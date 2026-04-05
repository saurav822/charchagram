import express from 'express';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('blog-route');
const router = express.Router();

// Validation schemas
const createBlogSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional()
});

const updateBlogSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
    content: z.string().min(1, "Content is required").optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the blog
 *         title:
 *           type: string
 *           description: The title of the blog
 *         content:
 *           type: string
 *           description: The content of the blog
 *         author:
 *           type: object
 *           description: The user who created the blog
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of comment IDs
 *         commentCount:
 *           type: number
 *           description: Number of comments
 *         views:
 *           type: number
 *           description: Number of views
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         isPublished:
 *           type: boolean
 *           description: Whether the blog is published
 *         slug:
 *           type: string
 *           description: URL-friendly slug
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of blogs per page
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalBlogs:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isPublished: true };
        if (req.query.author) {
            filter.author = req.query.author;
        }
        if (req.query.tag) {
            filter.tags = { $in: [req.query.tag] };
        }

        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        res.json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        log.error('Failed to fetch blogs', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name profileImage'
                }
            });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Increment view count
        await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.json({
            message: 'Blog fetched successfully',
            blog: blog
        });
    } catch (error) {
        log.error('Failed to fetch blog', error);
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
});

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *               content:
 *                 type: string
 *                 description: Blog content
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Blog tags
 *               isPublished:
 *                 type: boolean
 *                 description: Whether to publish the blog
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, async (req, res) => {
    try {

        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            preview: req.body.preview,
            tags: req.body.tags,
            createdAt: req.body.createdAt,
            updatedAt: req.body.createdAt,
            isUpdated: false,
            isPublished: req.body.isPublished || true,
            author: req.body.author,
            place: req.body.place
        });

        await blog.save();

        res.status(201).json({
            message: 'Blog created successfully',
            blog: blog
        });
    } catch (error) {
        log.error('Failed to create blog', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *               content:
 *                 type: string
 *                 description: Blog content
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Blog tags
 *               isPublished:
 *                 type: boolean
 *                 description: Whether to publish the blog
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog not found
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                preview: req.body.preview,
                place: req.body.place,
                author: req.body.author,
                tags: req.body.tags,
                isUpdated: req.body.isUpdated,
            },
            { new: true }
        );

        res.json({
            message: 'Blog updated successfully',
            blog: updatedBlog
        });
    } catch (error) {
        log.error('Failed to update blog', error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog not found
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        log.error('Failed to delete blog', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

/**
 * @swagger
 * /api/blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
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
 *                 description: Comment content
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Create comment
        const comment = new Comment({
            content: content.trim(),
            user: req.user.userId,
            blog: req.params.id
        });

        await comment.save();

        // Add comment to blog and increment comment count
        await Blog.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment._id },
            $inc: { commentCount: 1 }
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'name profileImage');

        res.status(201).json(populatedComment);
    } catch (error) {
        log.error('Failed to add comment to blog', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

//implement like blog
router.post('/like/:blogId', authenticateToken, async (req, res) => {
    try {
        const { blogId } = req.params;
        const user = req.user;
        const userIdString = user._id.toString();
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                error: 'Blog not found',
                message: 'No blog found with the provided ID'
            });
        }


        if (blog.like.length > 0) {
            const existingLike = blog.like.find(like => like.toString() === userIdString);
            if (existingLike) {
                blog.like = blog.like.filter(like => like.toString() !== userIdString);
                blog.likeCount = Math.max(0, blog.likeCount - 1);
                await blog.save();
                return res.status(200).json({
                    message: 'User has removed like from this blog',
                    likeCount: blog.likeCount,
                    likeArray: blog.like,
                    dislikeArray: blog.dislike,
                    dislikeCount: blog.dislikeCount
                });
            }
        }

        if (blog.dislike.length > 0) {
            const existingDislike = blog.dislike.find(dislike => dislike.toString() === userIdString);
            if (existingDislike) {
                blog.dislike = blog.dislike.filter(dislike => dislike.toString() !== userIdString);
                blog.dislikeCount = Math.max(0, blog.dislikeCount - 1);
            }
        }

        blog.like.push(userIdString);
        blog.likeCount += 1;
        await blog.save();

        res.status(200).json({
            message: 'Blog liked successfully',
            likeCount: blog.likeCount,
            likeArray: blog.like,
            dislikeArray: blog.dislike,
            dislikeCount: blog.dislikeCount
        });
    }
    catch (error) {
        log.error('Failed to like blog', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to like blog',
            details: error.message
        });
    }
});

//implement dislike blog
router.post('/dislike/:blogId', authenticateToken, async (req, res) => {
    try {
        const { blogId } = req.params;
        const user = req.user;
        const userIdString = user._id.toString();
        const blog = await Blog.findById(blogId);
        // Initialize arrays if they don't exist


        if (blog.dislike.length > 0) {
            const existingDislike = blog.dislike.find(dislike => dislike.toString() === userIdString);
            if (existingDislike) {
                blog.dislike = blog.dislike.filter(dislike => dislike.toString() !== userIdString);
                blog.dislikeCount = Math.max(0, blog.dislikeCount - 1);
                await blog.save();
                return res.status(200).json({
                    message: 'User has removed dislike from this blog',
                    likeCount: blog.likeCount,
                    likeArray: blog.like,
                    dislikeArray: blog.dislike,
                    dislikeCount: blog.dislikeCount
                });
            }
        }

        if (blog.like.length > 0) {
            const existingLike = blog.like.find(like => like.toString() === userIdString);
            if (existingLike) {
                blog.like = blog.like.filter(like => like.toString() !== userIdString);
                blog.likeCount = Math.max(0, blog.likeCount - 1);
            }
        }

        blog.dislike.push(userIdString);
        blog.dislikeCount += 1;
        await blog.save();

        res.status(200).json({
            message: 'Blog disliked successfully',
            likeCount: blog.likeCount,
            likeArray: blog.like,
            dislikeArray: blog.dislike,
            dislikeCount: blog.dislikeCount
        });
    }
    catch (error) {
        log.error('Failed to dislike blog', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to dislike blog',
            details: error.message
        });
    }
});


export default router;
