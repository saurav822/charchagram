import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import Constituency from '../models/constituency.js';
import { array, z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - constituency
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         description:
 *           type: string
 *           description: The description of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         author:
 *           type: object
 *           description: The user who created the post
 *         constituency:
 *           type: object
 *           description: The constituency this post belongs to
 *         category:
 *           type: object
 *           description: The category of the post
 *         views:
 *           type: number
 *           description: Number of views
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of comment IDs
 *         commentCount:
 *           type: number
 *           description: Number of comments
 *         like:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the post
 *         dislike:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who disliked the post
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags
 *         pollOptions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               votes:
 *                 type: array
 *                 items:
 *                   type: string
 *               percentage:
 *                 type: number
 *         pollType:
 *           type: string
 *           enum: [single, multiple]
 *           description: Type of poll (single or multiple choice)
 *         totalVotes:
 *           type: number
 *           description: Total number of votes in poll
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - constituency
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               description:
 *                 type: string
 *                 description: The description of the post
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 description: The content of the post
 *               constituency:
 *                 type: string
 *                 minLength: 1
 *                 description: The constituency ID
 *               category:
 *                 type: string
 *                 description: The category ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags
 *               link:
 *                 type: string
 *                 description: Optional link
 *               pollOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     votes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     percentage:
 *                       type: number
 *               pollType:
 *                 type: string
 *                 enum: [single, multiple]
 *                 description: Type of poll
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/constituency/{constituencyId}:
 *   get:
 *     summary: Get posts by constituency with pagination
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: constituencyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The constituency ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     pagination:
 *                       type: object
 *       400:
 *         description: Invalid constituency ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/poll/{postId}:
 *   post:
 *     summary: Vote in a poll
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID containing the poll
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionId
 *             properties:
 *               optionId:
 *                 type: number
 *                 description: The index of the poll option to vote for
 *     responses:
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid option ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/like/{postId}:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to like
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
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
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/dislike/{postId}:
 *   post:
 *     summary: Dislike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to dislike
 *     responses:
 *       200:
 *         description: Post disliked/undisliked successfully
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
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/stats/overview:
 *   get:
 *     summary: Get post statistics overview
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalPosts:
 *                       type: number
 *                     totalViews:
 *                       type: number
 *                     totalComments:
 *                       type: number
 *                     totalLikes:
 *                       type: number
 *                     totalDislikes:
 *                       type: number
 *                     avgViews:
 *                       type: number
 *                     avgComments:
 *                       type: number
 *                 topConstituencies:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/search/{query}:
 *   get:
 *     summary: Search posts by query
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (minimum 2 characters)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Search completed successfully
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     query:
 *                       type: string
 *                     pagination:
 *                       type: object
 *       400:
 *         description: Invalid search query
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/posts/allPosts:
 *   delete:
 *     summary: Delete all posts (Admin only)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: All posts deleted successfully
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

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a specific post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postData:
 *                 type: object
 *                 description: The updated post data
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Updated Post Title"
 *                   content:
 *                     type: string
 *                     example: "Updated post content"
 *                   category:
 *                     type: string
 *                     example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                   constituency:
 *                     type: string
 *                     example: "60f7b3b3b3b3b3b3b3b3b3b5"
 *                   isPoll:
 *                     type: boolean
 *                     example: false
 *                   pollOptions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         option:
 *                           type: string
 *                         votes:
 *                           type: number
 *                         percentage:
 *                           type: number
 *                     title:
 *                     type: string
 *                     example: "Updated Post Title"
 *                   content:
 *                     type: string
 *                     example: "Updated post content"
 *                   category:
 *                     type: string
                    example: "Updated Post Title"
 *                   content:
                    type: string
                    example: "Updated post content"
 *                   category:
                    type: string
                    example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                   constituency:
                    type: string
                    example: "60f7b3b3b3b3b3b3b3b3b3b5"
 *                   isPoll:
                    type: boolean
                    example: false
 *                   pollOptions:
                    type: array
                    items:
                      type: object
                      properties:
 *                         option:
                          type: string
 *                         votes:
                          type: number
                        percentage:
                          type: number
 *                   imageUrl:
                    type: string
                    example: "https://example.com/image.jpg"
 *                   tags:
 *                   type: array
                    items:
 *                       type: string
 *                     example: ["politics", "local"]
            required:
              - postData
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

// Zod schema for post validation
const createPostSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    author: z.string().min(1, "Author ID is required"),
    constituency: z.string().min(1, "Constituency ID is required"),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(), // This is already correct
    link: z.string().optional().or(z.literal("")),
    pollOptions: z.array(z.object({
        label: z.string().optional(),
        votes: z.array(z.string()).optional(),
        percentage: z.number().optional()
    })).optional(),
    pollType: z.string().optional(),
    totalVotes: z.number().optional()
});

// 1. Create Post
router.post('/', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        // console.log('req.body ', req.body);
        // Validate request body
        const validationResult = createPostSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Invalid input data',
                details: validationResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        const validatedData = validationResult.data;
        // Create new post
        const newPost = new Post({
            ...validatedData,
            category: validatedData.category,
            author: user._id, // Assuming you have user authentication
            commentCount: 0,
            constituency: validatedData.constituency,
            likeCount: 0,
            dislikeCount: 0,
            views: 0,
            pollOptions: validatedData.pollOptions ? validatedData.pollOptions.map(option => ({ ...option, votes: [], percentage: 0 })) : [],
            totalVotes: 0,
            pollType: validatedData.pollType
        });

        const savedPost = await newPost.save();
        // console.log('savedPost.constituency (raw):', savedPost.constituency);

        // Populate author and constituency details
        const checkPost = await Post.findById(savedPost._id);
        console.log('checkPost ', checkPost);
        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'name profileImage ageBracket gender phoneNumber email role')
            .populate('category', 'name')
            .populate('comments', 'content')
            .populate('constituency', 'area_name')
            .populate('pollOptions', 'option votes percentage')
            .populate('totalVotes', 'totalVotes');
        const postWithConstituency = await Post.findById(savedPost._id)
            .populate('constituency', 'area_name')
            .populate('pollOptions', 'option votes percentage')
            .populate('totalVotes', 'totalVotes');


        return res.status(201).json({
            message: 'Post created successfully',
            post: populatedPost
        });

    } catch (error) {
        console.error('Error creating post:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to create post',
                details: error.message
            });
        }
    }
});

// 2. Get All Posts by Constituency
router.post('/constituency', async (req, res) => {
    try {
        // const { constituencyIdArray } = req.params;
        // const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const { constituencyIdArray, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, userIdd, filterBy } = req.body;
        // Validate constituency ID
        
        // If constituencyIdArray is empty, get posts from all constituencies
        let completeConstituencyArray;
        let constituencyFilter;        
        if (constituencyIdArray.length === 0) {
            // Get all constituencies to fetch posts from all           
            constituencyFilter = {}; // Empty filter means all posts
        } else {
            completeConstituencyArray = [...constituencyIdArray];
            constituencyFilter = {
                constituency: {
                    $in: completeConstituencyArray.map(id => new mongoose.Types.ObjectId(String(id)))
                }
            };
        }        
        let posts;
        const skip = (parseInt(page) - 1) * parseInt(limit);


        if (Object.keys(constituencyFilter).length > 0) {
            const constituencyIds = constituencyFilter.constituency.$in;            
            for (const id of constituencyIds) {
                const exists = await Constituency.findById(id);
                
            }

            // Also check if any posts exist for these constituencies
            const postCount = await Post.countDocuments(constituencyFilter);
            
        }
        // Build sort object
        if (sortBy === 'engagement') {
            
            const pipeline = [];

            if (Object.keys(constituencyFilter).length > 0) {
                pipeline.push({ $match: constituencyFilter });
            }

            const testPosts = await Post.find(constituencyFilter).limit(5);            
            if (testPosts.length === 0) {
                
                // Try without filter to see if there are any posts at all
                const allPosts = await Post.find({}).limit(5);
                
            }

            pipeline.push(
                {
                    $addFields: {
                        likeCount: { $size: '$like' },
                        dislikeCount: { $size: '$dislike' },
                        engagementScore: {
                            $add: [
                                { $size: '$like' },
                                { $size: '$dislike' },
                                '$commentCount'
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        engagementScore: sortOrder === 'desc' ? -1 : 1,
                        createdAt: -1
                    }
                }
            );                                    
            posts = await Post.aggregate(pipeline);

            // Populate the aggregated results
            await Post.populate(posts, [
                { path: 'author', select: 'name profileImage ageBracket gender phoneNumber email role' },
                { path: 'constituency', select: 'area_name' },
                { path: 'category', select: 'name' },
                {
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'name profileImage ageBracket gender phoneNumber email role',
                        populate: {
                            path: 'constituency',
                            select: 'area_name'
                        }
                    },
                    select: 'content user createdAt like dislike likeCount dislikeCount',
                    options: { sort: { createdAt: -1 } }
                }
            ]);
        }
        else {
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // Get posts with sorting (no pagination yet)        
            posts = await Post.find(constituencyFilter)
                .populate('author', 'name profileImage ageBracket gender phoneNumber email role')
                .populate('constituency', 'area_name')
                .populate('category', 'name')
                .populate({ // Added this block to populate comments
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'name profileImage ageBracket gender phoneNumber email role',
                        populate: {
                            path: 'constituency',
                            select: 'area_name'
                        }
                    },
                    select: 'content user createdAt like dislike likeCount dislikeCount', // Select content and user (name)
                    options: { sort: { createdAt: -1 } } // Sort comments by creation date
                })
                .populate('pollOptions', 'option votes percentage')
                .populate('totalVotes', 'totalVotes')
                .sort(sortOptions);
        }

        // Apply userId filter before pagination
        if (userIdd && userIdd.length > 0) {
            posts = posts.filter(post => {
                const authorId = post.author?._id?.toString();
                return authorId === userIdd;
            });
        }

        // Apply pagination after filtering
        const totalPosts = posts.length;
        const paginatedPosts = posts.slice(skip, skip + parseInt(limit));

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalPosts / parseInt(limit));
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            message: 'Posts retrieved successfully',
            data: {
                paginatedPosts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalPosts,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching posts by constituency:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch posts by constituency',
            details: error.message
        });
    }
});

// 3. Get All Posts
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            userIdd,
        } = req.query;

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        let posts;

        if (sortBy === 'engagement') {
            posts = await Post.aggregate([
                {
                    $addFields: {
                        likeCount: { $size: '$like' },
                        dislikeCount: { $size: '$dislike' },
                        engagementScore: {
                            $add: [
                                { $size: '$like' },
                                { $size: '$dislike' },
                                '$commentCount'
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        engagementScore: sortOrder === 'desc' ? -1 : 1,
                        createdAt: -1  // Tiebreaker: most recent first
                    }
                },
                // { $skip: skip },
                // { $limit: parseInt(limit) }
            ]);

            // Populate the aggregated results
            await Post.populate(posts, [
                { path: 'author', select: 'name profileImage ageBracket gender phoneNumber email role' },
                { path: 'constituency', select: 'area_name' },
                { path: 'category', select: 'name' },
                {
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'name profileImage ageBracket gender phoneNumber email role',
                        populate: {
                            path: 'constituency',
                            select: 'area_name'
                        }
                    },
                    select: 'content user createdAt like dislike likeCount dislikeCount',
                    options: { sort: { createdAt: -1 } }
                }
            ]);
        }
        else {

            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
            // Get posts with pagination and sorting
            posts = await Post.find({})
                .populate('author', 'name profileImage ageBracket gender phoneNumber email role')
                .populate('constituency', 'area_name')
                .populate('category', 'name')
                .populate({ // Added this block to populate comments
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'name profileImage ageBracket gender phoneNumber email role',
                        populate: {
                            path: 'constituency',
                            select: 'area_name'
                        }
                    },
                    select: 'content user createdAt like dislike likeCount dislikeCount', // Select content and user (name)
                    options: { sort: { createdAt: -1 } } // Sort comments by creation date
                })
                .sort(sortOptions)
            // .skip(skip)
            // .limit(parseInt(limit));
        }


        if (userIdd && userIdd.length > 0) {
            posts = posts.filter(post => {
                const authorId = post.author?._id?.toString();
                return authorId === userIdd;
            });
        }
        // Get total count for pagination   
        // const totalPosts = await Post.countDocuments({});
        const totalPosts = posts.length;
        const paginatedPosts = posts.slice(skip, skip + parseInt(limit));

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalPosts / parseInt(limit));
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            message: 'Posts retrieved successfully',
            data: {
                paginatedPosts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalPosts,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch posts',
            details: error.message
        });
    }
});

//update post by id
router.put('/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { postData } = req.body;            
        const postObjectOld = await Post.findById(postId);
        
        //content 
        postObjectOld.content = postData.content;
        postObjectOld.tags = postData.tags;
        postObjectOld.updatedAt = Date.now();
        postObjectOld.category = {_id: postData.category._id, name: postData.category.name};
        postObjectOld.isEdited = true;
        //polloption
        for (let pollOption of postData.pollOptions) {
            if (postObjectOld.pollOptions.some(option => option.label === pollOption.label)) { }
            else {
                const pollOptionObject = {
                    label: pollOption.label,
                    votes: [],
                    percentage: 0
                };
                postObjectOld.pollOptions.push(pollOptionObject);
            }
        }

        console.log('postObjectOld 9093', postObjectOld)
        const updatedPost = await postObjectOld.save();
        res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update post',
            details: error.message
        });
    }
});

// 4. Get Post by ID
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate post ID
        if (!postId || postId.length !== 24) {
            return res.status(400).json({
                error: 'Invalid post ID',
                message: 'Post ID must be a valid MongoDB ObjectId'
            });
        }

        // Get post with all related data
        const post = await Post.findById(postId)
            .populate('author', 'name profileImage ageBracket gender phoneNumber email role')
            .populate('constituency', 'area_name vidhayak_info')
            .populate('category', 'name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name profileImage ageBracket gender phoneNumber email role',
                    populate: {
                        path: 'constituency',
                        select: '_id area_name'
                    }
                },
                options: { sort: { createdAt: -1 } }
            })
            .populate('pollOptions', 'option votes percentage')
            .populate('totalVotes', 'totalVotes');

        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.status(200).json({
            message: 'Post retrieved successfully',
            post
        });

    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch post',
            details: error.message
        });
    }
});

// 5. Get Posts in Sorted Order
router.get('/sorted/:sortBy', async (req, res) => {
    try {
        const { sortBy } = req.params;
        const { page = 1, limit = 10, sortOrder = 'desc', constituency } = req.query;

        // Validate sortBy parameter
        const validSortFields = ['createdAt', 'views', 'commentCount', 'likeCount', 'dislikeCount'];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({
                error: 'Invalid sort field',
                message: `Sort field must be one of: ${validSortFields.join(', ')}`,
                validSortFields
            });
        }

        // Build filter object
        const filter = { status: 'published' };
        if (constituency) {
            filter.constituency = constituency;
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get posts with pagination and sorting
        const posts = await Post.find(filter)
            .populate('author', 'name profileImage ageBracket gender phoneNumber email role')
            .populate('constituency', 'area_name')
            .populate('category', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalPosts = await Post.countDocuments(filter);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalPosts / parseInt(limit));
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            message: `Posts sorted by ${sortBy} retrieved successfully`,
            data: {
                posts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalPosts,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                },
                sorting: {
                    sortBy,
                    sortOrder,
                    constituency: constituency || 'all'
                }
            }
        });

    } catch (error) {
        console.error('Error fetching sorted posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch sorted posts',
            details: error.message
        });
    }
});

// Additional utility endpoints
router.post('/poll/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { optionId } = req.body;
        const user = req.user;
        const optionIdNumber = Number(optionId);
        const userId = user._id.toString();
        const post = await Post.findById(postId);
        const pollType = post.pollType;
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }
        switch (pollType) {
            case 'single':
                updateSinglePoll(post, optionIdNumber, userId);
                break;
            case 'multiple':
                updateMultiplePoll(post, optionIdNumber, userId);
                break;
        }

        await post.save();
        return res.status(200).json({
            message: 'Vote updated successfully',
            post: post
        });
    }
    catch (error) {
        console.error('Error voting in poll:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to vote in poll',
            details: error.message
        });
    }
})
// Get post statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await Post.aggregate([
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    totalViews: { $sum: '$views' },
                    totalComments: { $sum: '$commentCount' },
                    totalLikes: { $sum: '$likeCount' },
                    totalDislikes: { $sum: '$dislikeCount' },
                    avgViews: { $avg: '$views' },
                    avgComments: { $avg: '$commentCount' }
                }
            }
        ]);

        const constituencyStats = await Post.aggregate([
            {
                $group: {
                    _id: '$constituency',
                    postCount: { $sum: 1 },
                    totalViews: { $sum: '$views' }
                }
            },
            {
                $sort: { postCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json({
            message: 'Post statistics retrieved successfully',
            stats: stats[0] || {},
            topConstituencies: constituencyStats
        });

    } catch (error) {
        console.error('Error fetching post statistics:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch post statistics',
            details: error.message
        });
    }
});

// Search posts
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                error: 'Invalid search query',
                message: 'Search query must be at least 2 characters long'
            });
        }

        const searchRegex = { $regex: query, $options: 'i' };
        const filter = {
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { content: searchRegex }
            ],
            status: 'published'
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find(filter)
            .populate('author', 'name')
            .populate('constituency', 'area_name')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalPosts = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / parseInt(limit));

        res.status(200).json({
            message: 'Search completed successfully',
            data: {
                posts,
                query,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalPosts,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to search posts',
            details: error.message
        });
    }
});

router.post('/like/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const user = req.user;
        const userIdString = user._id.toString();
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }
        const existingLike = post.like.find(like => like.toString() === userIdString);
        if (existingLike) {
            post.like = post.like.filter(like => like.toString() !== userIdString);
            post.likeCount = Math.max(0, post.likeCount - 1);
            await post.save();
            return res.status(200).json({
                message: 'User has removed like from this post',
                likeCount: post.likeCount,
                likeArray: post.like,
                dislikeArray: post.dislike,
                dislikeCount: post.dislikeCount
            });
        }
        const existingDislike = post.dislike.find(dislike => dislike.toString() === userIdString);
        if (existingDislike) {
            post.dislike = post.dislike.filter(dislike => dislike.toString() !== userIdString);
            post.dislikeCount -= 1;
        }
        post.like.push(userIdString);
        post.likeCount += 1;
        await post.save();
        res.status(200).json({
            message: 'Post liked successfully',
            likeCount: post.likeCount,
            likeArray: post.like,
            dislikeArray: post.dislike,
            dislikeCount: post.dislikeCount

        });
    }
    catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to like post',
            details: error.message
        });
    }
});

router.post('/dislike/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const user = req.user;
        const userIdString = user._id.toString();
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }
        const existingDislike = post.dislike.find(dislike => dislike.toString() === userIdString);
        if (existingDislike) {
            post.dislike = post.dislike.filter(dislike => dislike.toString() !== userIdString);
            post.dislikeCount -= 1;
            await post.save();
            return res.status(200).json({
                message: 'User has removed dislike from this post',
                likeCount: post.likeCount,
                likeArray: post.like,
                dislikeArray: post.dislike,
                dislikeCount: post.dislikeCount

            });
        }
        const existingLike = post.like.find(like => like.toString() === userIdString);
        if (existingLike) {
            post.like = post.like.filter(like => like.toString() !== userIdString);
            post.likeCount -= 1;
        }
        post.dislike.push(userIdString);
        post.dislikeCount += 1;
        await post.save();
        res.status(200).json({
            message: 'Post disliked successfully',
            likeCount: post.likeCount,
            likeArray: post.like,
            dislikeArray: post.dislike,
            dislikeCount: post.dislikeCount
        });
    }
    catch (error) {
        console.error('Error disliking post:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to dislike post',
            details: error.message
        });
    }
});


router.delete('/allPosts', async (req, res) => {
    try {
        await Post.deleteMany({});
        res.status(200).json({
            message: 'All posts deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting all posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete all posts',
            details: error.message
        });
    }
});
router.delete('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const postObject = await Post.findById(postId)
        if (!postObject) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with the provided ID'
            });
        }
        await postObject.deleteOne();
        res.status(200).json({
            message: 'Post deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete post',
            details: error.message
        });
    }
});

router.get('/getPostByAuthor/:authorId', async (req, res) => {
    try {
        const { authorId } = req.params;
        const posts = await Post.find({ author: authorId });
        await Post.populate(posts, [
            { path: 'author', select: 'name profileImage ageBracket gender phoneNumber email role' },
            { path: 'constituency', select: 'area_name' },
            { path: 'category', select: 'name' },
            {
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name profileImage ageBracket gender phoneNumber email role',
                    populate: {
                        path: 'constituency',
                        select: 'area_name'
                    }
                },
                select: 'content user createdAt like dislike likeCount dislikeCount',
                options: { sort: { createdAt: -1 } }
            },
            { path: 'pollOptions', select: 'option votes percentage' },
            { path: 'totalVotes', select: 'totalVotes' }
        ]);
        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts
        });
    }
    catch (error) {
        console.error('Error fetching posts by author:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch posts by author',
            details: error.message
        });
    }
});

const updateMultiplePoll = (post, optionIdNumber, userId) => {
    const existingVoteInTheGivenOption = post.pollOptions[optionIdNumber].votes.some(vote => vote.toString() === userId);
    if (existingVoteInTheGivenOption) {
        // Remove existing vote
        post.pollOptions[optionIdNumber].votes = post.pollOptions[optionIdNumber].votes.filter(vote => vote.toString() !== userId);
        post.totalVotes = Math.max(0, post.totalVotes - 1);

        // Recalculate percentages for all options
        post.pollOptions.forEach(option => {
            option.percentage = post.totalVotes > 0 ?
                Math.round((option.votes.length / post.totalVotes) * 100) : 0;
        });

    } else {
        post.totalVotes += 1;
        for (const [index, pollOption] of post.pollOptions.entries()) {
            if (optionIdNumber === index) {
                pollOption.votes.push(userId);
            }
            pollOption.percentage = post.totalVotes > 0 ?
                Math.round((pollOption.votes.length / post.totalVotes) * 100) : 0;
        }

    }
}
const updateSinglePoll = (post, optionIdNumber, userId) => {
    // Check if user has voted for the current option
    const hasVotedForCurrentOption = post.pollOptions[optionIdNumber].votes.some(vote => vote.toString() === userId);

    if (hasVotedForCurrentOption) {
        // User is clicking the same option - remove their vote (toggle off)
        post.pollOptions[optionIdNumber].votes = post.pollOptions[optionIdNumber].votes.filter(vote => vote.toString() !== userId);
        post.totalVotes = Math.max(0, post.totalVotes - 1);
    } else {
        // Remove user's vote from ALL options first
        post.pollOptions.forEach(option => {
            const originalLength = option.votes.length;
            option.votes = option.votes.filter(vote => vote.toString() !== userId);
            // If a vote was removed, decrement totalVotes
            if (option.votes.length < originalLength) {
                post.totalVotes = Math.max(0, post.totalVotes - 1);
            }
        });

        // Add vote to new option
        post.pollOptions[optionIdNumber].votes.push(userId);
        post.totalVotes += 1;
    }

    // Recalculate percentages for all options
    post.pollOptions.forEach(option => {
        option.percentage = post.totalVotes > 0 ?
            Math.round((option.votes.length / post.totalVotes) * 100) : 0;
    });

}


export default router;
