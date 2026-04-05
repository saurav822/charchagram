import express from 'express';
import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Zod schema for comment validation
const createCommentSchema = z.object({
    post: z.string().min(1, "Post ID is required"),
    user: z.string().min(1, "User ID is required"),
    content: z.string().min(1, "Comment content is required").max(1000, "Comment must be less than 1000 characters"),
    parentComment: z.string().optional(),
    link: z.string().url("Link must be a valid URL").optional().or(z.literal(""))
});

// Zod schema for like/dislike validation
const reactionSchema = z.object({
    commentId: z.string().min(1, "Comment ID is required")
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - post
 *         - user
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         post:
 *           type: string
 *           description: The ID of the post this comment belongs to
 *         user:
 *           type: object
 *           description: The user who created the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         link:
 *           type: string
 *           description: Optional link in the comment
 *         parentComment:
 *           type: string
 *           description: ID of parent comment for nested comments
 *         like:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the comment
 *         dislike:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who disliked the comment
 *         likeCount:
 *           type: number
 *           description: Number of likes
 *         dislikeCount:
 *           type: number
 *           description: Number of dislikes
 *         replyCount:
 *           type: number
 *           description: Number of replies
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Create a new comment on a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: The content of the comment
 *               link:
 *                 type: string
 *                 format: uri
 *                 description: Optional link in the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post('/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, link } = req.body;
        const user = req.user;

        //find the post by postId
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }
        //craete a new comment object
        const newComment = new Comment({
            post: postId,
            user: user,
            constituency: post.constituency,
            parentComment: null,
            content: content,
            link: link,
            like: [],
            dislike: [],
            replyCount: 0
        })

        //save the comment
        const savedComment = await newComment.save();

        //add the comment to the post
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 }, $push: { comments: savedComment._id } });
        const populatedComment = await Comment.findById(savedComment._id)
            .populate({ path: 'user', select: 'name', populate: { path: 'constituency', select: 'area_name' } })
            .populate('constituency', 'area_name')
            .populate('parentComment', 'content user');
        console.log('populatedComment ', populatedComment);
        res.status(201).json({
            message: 'Comment created successfully',
            comment: populatedComment
        });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create comment',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/reply/{commentId}:
 *   post:
 *     summary: Create a reply to a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - user
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: The content of the reply
 *               link:
 *                 type: string
 *                 format: uri
 *                 description: Optional link in the reply
 *               user:
 *                 type: string
 *                 description: The ID of the user creating the reply
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reply:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Parent comment not found
 *       500:
 *         description: Internal server error
 */
router.post('/reply/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content, link, user } = req.body; // Add user to destructuring

        // Validate comment ID
        if (!commentId || commentId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid comment ID',
                message: 'Comment ID must be a valid MongoDB ObjectId'
            });
        }

        // Validate content
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                error: 'Content required',
                message: 'Comment content is required'
            });
        }

        if (content.length > 1000) {
            return res.status(400).json({
                error: 'Content too long',
                message: 'Comment must be less than 1000 characters'
            });
        }

        // Check if parent comment exists
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({
                error: 'Parent comment not found',
                message: 'No comment found with the provided ID'
            });
        }

        // Create nested comment
        const newReply = new Comment({
            post: parentComment.post,
            user: user, // Use the user from request body
            constituency: parentComment.constituency,
            parentComment: commentId,
            content: content.trim(),
            link: link || null,
            like: [], // Use like array as per your schema
            dislike: [], // Use dislike array as per your schema
            replyCount: 0
        });

        const savedReply = await newReply.save();

        // Update parent comment's reply count AND add reply to replies array
        await Comment.findByIdAndUpdate(
            commentId,
            {
                $inc: { replyCount: 1 },
                $push: { replies: savedReply._id } // Add this line to push reply ID to array
            }
        );

        // Update post's comment count AND add comment to comments array


        // Populate reply with user details
        const populatedReply = await Comment.findById(savedReply._id)
            .populate('user', 'name')
            .populate('constituency', 'area_name')
            .populate('parentComment', 'content user');

        res.status(201).json({
            message: 'Reply created successfully',
            reply: populatedReply
        });

    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create reply',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/like/{commentId}:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to like
 *     responses:
 *       200:
 *         description: Comment liked/unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *                 likeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dislikeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dislikeCount:
 *                   type: number
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post('/like/:commentId', authenticateToken, async (req, res) => {
    try {
        const { commentId } = req.params;
        // const userId = req.body.userId;
        const user = req.user;
        const userIdString = user._id.toString();


        // Validate comment ID
        if (!commentId || commentId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid comment ID',
                message: 'Comment ID must be a valid MongoDB ObjectId'
            });
        }

        // Check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                message: 'No comment found with the provided ID'
            });
        }

        // Check if user already liked the comment
        const existingLike = comment.like.find(like => like.toString() === userIdString);
        if (existingLike) {
            comment.like = comment.like.filter(like => like.toString() !== userIdString);
            comment.likeCount = Math.max(0, comment.likeCount - 1);
            await comment.save();
            return res.status(200).json({
                message: 'User has removed like from this comment',
                likeCount: comment.likeCount,
                likeArray: comment.like,
                dislikeArray: comment.dislike,
                dislikeCount: comment.dislikeCount
            });
        }

        // Check if user disliked the comment and remove dislike
        const existingDislike = comment.dislike.find(dislike => dislike.toString() === userIdString);
        if (existingDislike) {
            comment.dislike = comment.dislike.filter(dislike => dislike.toString() !== userIdString);
            comment.dislikeCount = Math.max(0, comment.dislikeCount - 1);
        }

        // Add like
        comment.like.push(userIdString);
        comment.likeCount = comment.like.length + 1;

        await comment.save();

        res.status(200).json({
            message: 'Comment liked successfully',
            likeCount: comment.likeCount,
            likeArray: comment.like,
            dislikeArray: comment.dislike,
            dislikeCount: comment.dislikeCount
        });

    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to like comment',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/dislike/{commentId}:
 *   post:
 *     summary: Dislike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to dislike
 *     responses:
 *       200:
 *         description: Comment disliked/undisliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *                 likeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dislikeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dislikeCount:
 *                   type: number
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post('/dislike/:commentId', authenticateToken, async (req, res) => {
    try {
        const { commentId } = req.params;
        const user = req.user;
        const userIdString = user._id.toString();

        // Validate comment ID
        if (!commentId || commentId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid comment ID',
                message: 'Comment ID must be a valid MongoDB ObjectId'
            });
        }

        // Check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                message: 'No comment found with the provided ID'
            });
        }

        // Check if user already disliked the comment
        const existingDislike = comment.dislike.find(dislike => dislike.toString() === userIdString);
        if (existingDislike) {
            comment.dislike = comment.dislike.filter(dislike => dislike.toString() !== userIdString);
            comment.dislikeCount = Math.max(0, comment.dislikeCount - 1);
            await comment.save();
            return res.status(200).json({
                message: 'User has removed dislike from this comment',
                likeCount: comment.likeCount,
                likeArray: comment.like,
                dislikeArray: comment.dislike,
                dislikeCount: comment.dislikeCount
            });
        }

        // Check if user liked the comment and remove like
        const existingLike = comment.like.find(like => like.toString() === userIdString);
        if (existingLike) {
            comment.like = comment.like.filter(like => like.toString() !== userIdString);
            comment.likeCount = Math.max(0, comment.likeCount - 1);
        }

        // Add dislike
        comment.dislike.push(userIdString);
        comment.dislikeCount = comment.dislike.length + 1;

        await comment.save();

        res.status(200).json({
            message: 'Comment disliked successfully',
            likeCount: comment.likeCount,
            likeArray: comment.like,
            dislikeArray: comment.dislike,
            dislikeCount: comment.dislikeCount
        });

    } catch (error) {
        console.error('Error disliking comment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to dislike comment',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/{commentId}:
 *   get:
 *     summary: Get a comment by ID with replies
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to retrieve
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
// Get comment by ID with replies
router.get('/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        // Validate comment ID
        if (!commentId || commentId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid comment ID',
                message: 'Comment ID must be a valid MongoDB ObjectId'
            });
        }

        // Get comment with replies
        const comment = await Comment.findById(commentId)
            .populate('user', 'name')
            .populate('constituency', 'area_name')
            .populate('parentComment', 'content user')
            .populate({
                path: 'replies',
                populate: {
                    path: 'user',
                    select: 'name'
                },
                options: { sort: { createdAt: 1 } }
            });

        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                message: 'No comment found with the provided ID'
            });
        }

        res.status(200).json({
            message: 'Comment retrieved successfully',
            comment
        });

    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch comment',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/{commentId}/replies:
 *   get:
 *     summary: Get all replies for a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to get replies for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of replies per page
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     replies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalReplies:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *                         limit:
 *                           type: integer
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
// Get all replies for a comment
router.get('/:commentId/replies', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate comment ID
        if (!commentId || commentId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid comment ID',
                message: 'Comment ID must be a valid MongoDB ObjectId'
            });
        }

        // Check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                message: 'No comment found with the provided ID'
            });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get replies with pagination
        const replies = await Comment.find({ parentComment: commentId })
            .populate('user', 'name')
            .populate('constituency', 'area_name')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalReplies = await Comment.countDocuments({ parentComment: commentId });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalReplies / parseInt(limit));
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            message: 'Replies retrieved successfully',
            data: {
                replies,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalReplies,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch replies',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/allComments:
 *   delete:
 *     summary: Delete all comments (Admin only)
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: All comments deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.delete('/allComments', async (req, res) => {
    try {
        await Comment.deleteMany({});
        res.status(200).json({
            message: 'All comments deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting all comments:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete all comments',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a specific comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
                message: 'No comment found with the provided ID'
            });
        }
        await comment.deleteOne();
        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete comment',
            details: error.message
        });
    }
});



export default router;
