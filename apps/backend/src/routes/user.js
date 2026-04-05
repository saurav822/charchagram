import express from 'express';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { z } from 'zod';
import { randomNameGenerator } from '../utils/user.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('user-route');
const router = express.Router();
// Zod schema for user validation
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  constituency: z.string().optional(),
  email: z.string().optional(),
  ageBracket: z.string().optional(),
  role: z.string().optional(),
  gender: z.string().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user (unique)
 *         constituency:
 *           type: object
 *           description: The constituency the user belongs to
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         ageBracket:
 *           type: string
 *           enum: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
 *           description: The age bracket of the user
 *         gender:
 *           type: string
 *           enum: ['male', 'female', 'other', 'prefer_not_to_say']
 *           description: The gender of the user
 *         profileImage:
 *           type: string
 *           description: URL to the user's profile image
 *         role:
 *           type: string
 *           enum: ['user', 'admin', 'moderator']
 *           default: user
 *           description: The role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: The name of the user
 *         constituency:
 *           type: string
 *           description: The constituency ID
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         ageBracket:
 *           type: string
 *           enum: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
 *           description: The age bracket of the user
 *         gender:
 *           type: string
 *           enum: ['male', 'female', 'other', 'prefer_not_to_say']
 *           description: The gender of the user
 *         role:
 *           type: string
 *           enum: ['user', 'admin', 'moderator']
 *           description: The role of the user
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           description: Current page number
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *         totalUsers:
 *           type: integer
 *           description: Total number of users
 *         hasNextPage:
 *           type: boolean
 *           description: Whether there is a next page
 *         hasPrevPage:
 *           type: boolean
 *           description: Whether there is a previous page
 *         limit:
 *           type: integer
 *           description: Number of items per page
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
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
 *           default: 20
 *         description: Number of users per page
 *       - in: query
 *         name: constituency
 *         schema:
 *           type: string
 *         description: Filter by constituency ID
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, constituency } = req.query;

    // Build filter
    const filter = {};
    if (constituency) {
      filter.constituency = constituency;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination
    const users = await User.find(filter)
      .populate('constituency', 'area_name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v'); // Exclude version key

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    log.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch users',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/phone/{phoneNumber}:
 *   get:
 *     summary: Get user by phone number
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 10
 *         description: The phone number of the user to retrieve
 *         example: "9876543210"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid phone number"
 *                 message:
 *                   type: string
 *                   example: "Phone number must be at least 10 digits"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "No user found with the provided phone number"
 *       500:
 *         description: Internal server error
 */
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber || phoneNumber.trim().length < 10) {
      return res.status(400).json({
        error: 'Invalid phone number',
        message: 'Phone number must be at least 10 digits'
      });
    }

    const user = await User.findOne({ phoneNumber: phoneNumber.trim() })
      .populate('constituency', 'area_name');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided phone number'
      });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });

  } catch (error) {
    log.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user',
      details: error.message
    });
  }
});

router.get('/randomUserName', async (req, res) => {
  try {
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop

    while (attempts < maxAttempts) {
      const randomUserName = randomNameGenerator();
      const user = await User.getByUserName(randomUserName);

      if (!user) {
        // User name is unique, return it
        return res.status(200).json({
          message: 'Random user name generated successfully',
          userName: randomUserName
        });
      }

      attempts++;
    }

    // If we couldn't find a unique name after max attempts
    return res.status(500).json({
      error: 'Unable to generate unique user name',
      message: 'Could not generate a unique user name after multiple attempts'
    });
  }
  catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate random user name',
      details: error.message
    });
  }
})

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the user to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           examples:
 *             updateName:
 *               summary: Update user name
 *               value:
 *                 name: "John Doe Updated"
 *             updateProfile:
 *               summary: Update user profile
 *               value:
 *                 name: "Jane Smith"
 *                 email: "jane.smith@example.com"
 *                 ageBracket: "26-35"
 *                 gender: "female"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "No user found with the provided ID"
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;

    const userDataOld = await User.findById(userId);
    userDataOld.gender = userData.gender;
    userDataOld.ageBracket = userData.ageBracket;
    userDataOld.constituency = userData.constituency;
    userDataOld.updatedAt = Date.now();

    const updatedUser = await userDataOld.save();
    const populatedUser = await updatedUser.populate('constituency', 'area_name english_name');

    res.status(200).json({
      message: 'User updated successfully',
      user: populatedUser
    });

  } catch (error) {
    log.error('Error updating user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the user
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID"
 *                 message:
 *                   type: string
 *                   example: "User ID must be a valid MongoDB ObjectId"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "No user found with the provided ID"
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a valid MongoDB ObjectId'
      });
    }

    const user = await User.findById(userId)
      .populate('constituency', 'area_name english_name');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });

  } catch (error) {
    log.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user',
      details: error.message
    });
  }
});



/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user and all associated data
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the user to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User and associated data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User and all associated comments deleted successfully"
 *                 deletedCommentsCount:
 *                   type: integer
 *                   description: Number of comments that were deleted
 *                   example: 15
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID"
 *                 message:
 *                   type: string
 *                   example: "User ID must be a valid MongoDB ObjectId"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "No user found with the provided ID"
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        error: 'Invalid user ID ',
        message: 'User ID must be a valid MongoDB ObjectId'
      });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    // Delete all posts by this user
    await post.deleteMany({ author: userId });

    // Delete all comments by this user
    const userComments = await comment.find({ user: userId });

    // Update post comment counts and remove comment references
    for (const commentItem of userComments) {
      await post.findByIdAndUpdate(
        commentItem.post,
        {
          $pull: { comments: commentItem._id },
          $inc: { commentCount: -1 }
        }
      );
    }

    // Delete all comments by this user
    await comment.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'User and all associated comments deleted successfully',
      deletedCommentsCount: userComments.length
    });

  } catch (error) {
    log.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/allUsers:
 *   delete:
 *     summary: Delete all users and associated data (Admin only)
 *     tags: [Users]
 *     description: |
 *       **⚠️ DANGER: This endpoint deletes ALL data from the system!**
 *       
 *       This operation will permanently delete:
 *       - All users
 *       - All posts
 *       - All comments
 *       
 *       This action cannot be undone. Use with extreme caution!
 *     responses:
 *       200:
 *         description: All data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users, posts, and comments deleted successfully"
 *                 deleted:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: string
 *                       example: "All users deleted"
 *                     posts:
 *                       type: string
 *                       example: "All posts deleted"
 *                     comments:
 *                       type: string
 *                       example: "All comments deleted"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.delete('/allUsers', async (req, res) => {
  try {
    // Delete all comments first
    await comment.deleteMany({});

    // Delete all posts
    await post.deleteMany({});

    // Delete all users
    await User.deleteMany({});

    res.status(200).json({
      message: 'All users, posts, and comments deleted successfully',
      deleted: {
        users: 'All users deleted',
        posts: 'All posts deleted',
        comments: 'All comments deleted'
      }
    });
  }
  catch (error) {
    log.error('Error deleting all data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete all data',
      details: error.message
    });
  }
});



export default router;