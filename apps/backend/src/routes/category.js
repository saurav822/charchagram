import express from 'express';
import Category from '../models/category.js';
import { z } from 'zod';
import { createLogger } from '../utils/logger.js';

const log = createLogger('category-route');
const router = express.Router();

// Zod schema for category validation
const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters"),
});
//
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the category
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: The name of the category (stored in lowercase)
 *         description:
 *           type: string
 *           description: Optional description of the category
 *         usedCount:
 *           type: number
 *           description: Number of times this category is used
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the category was last updated
 *     CategoryCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: The name of the category
 *           example: "Politics"
 *     BulkCategoryCreate:
 *       type: object
 *       required:
 *         - categories
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryCreate'
 *           description: Array of categories to create
 *           example:
 *             - name: "Politics"
 *             - name: "Sports"
 *             - name: "Education"
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *           examples:
 *             politics:
 *               summary: Politics category
 *               value:
 *                 name: "Politics"
 *             sports:
 *               summary: Sports category
 *               value:
 *                 name: "Sports"
 *             education:
 *               summary: Education category
 *               value:
 *                 name: "Education"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       409:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category already exists"
 *                 message:
 *                   type: string
 *                   example: "A category with this name already exists"
 *       500:
 *         description: Internal server error
 */
// 1. Create Category
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validationResult = createCategorySchema.safeParse(req.body);
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

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: validatedData.name.toLowerCase() });
    if (existingCategory) {
      return res.status(409).json({
        error: 'Category already exists',
        message: 'A category with this name already exists'
      });
    }

    // Create new category
    const newCategory = new Category({
      ...validatedData,
      name: validatedData.name.toLowerCase()
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: savedCategory // Changed to category
    });

  } catch (error) {
    log.error('Failed to create category', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create Category',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/bulk:
 *   post:
 *     summary: Create multiple categories at once
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCategoryCreate'
 *           examples:
 *             multipleCategories:
 *               summary: Create multiple categories
 *               value:
 *                 categories:
 *                   - name: "Politics"
 *                   - name: "Sports"
 *                   - name: "Education"
 *                   - name: "Health"
 *                   - name: "Technology"
 *     responses:
 *       201:
 *         description: Categories created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categories created successfully"
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post('/bulk', async (req, res) => {
  try {
    const { categories } = req.body;
    log.debug('bulk create request', { count: categories?.length });
    const createdCategories = await Category.insertMany(categories);
    res.status(201).json({
      message: 'Categories created successfully',
      categories: createdCategories
    });
  } catch (error) {
    log.error('Failed to bulk create categories', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create categories',
      details: error.message
    });
  }
});
// 2. Get All Categories
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with pagination
 *     tags: [Categories]
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
 *         description: Number of categories per page
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categories retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalCategories:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get categories with pagination
    const categories = await Category.find({}) // Corrected: Use find instead of findAll
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalCategories = await Category.countDocuments({}); // Corrected: Use countDocuments

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: {
        categories, // Changed to categories
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories, // Changed to totalCategories
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    log.error('Failed to fetch categories', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch categories',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the category
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category retrieved successfully"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid category ID"
 *                 message:
 *                   type: string
 *                   example: "Category ID must be a valid MongoDB ObjectId"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *                 message:
 *                   type: string
 *                   example: "No category found with the provided ID"
 *       500:
 *         description: Internal server error
 */
// 3. Get Category by ID
router.get('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category ID
    if (!categoryId || categoryId.length !== 24) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a valid MongoDB ObjectId'
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with the provided ID'
      });
    }

    res.status(200).json({
      message: 'Category retrieved successfully',
      category // Changed to category
    });

  } catch (error) {
    log.error('Failed to fetch category', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch category',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the category to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *           examples:
 *             updateName:
 *               summary: Update category name
 *               value:
 *                 name: "Updated Politics"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category updated successfully"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation failed or invalid category ID
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 */
// 4. Update Category
router.put('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category ID
    if (!categoryId || categoryId.length !== 24) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a valid MongoDB ObjectId'
      });
    }

    // Validate request body
    const validationResult = createCategorySchema.partial().safeParse(req.body);
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

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with the provided ID'
      });
    }

    // Check if new name conflicts with existing category
    if (validatedData.name) {
      const nameConflict = await Category.findOne({ 
        name: validatedData.name.toLowerCase(),
        _id: { $ne: categoryId }
      });
      if (nameConflict) {
        return res.status(409).json({
          error: 'Category name conflict',
          message: 'A category with this name already exists'
        });
      }
      validatedData.name = validatedData.name.toLowerCase();
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory // Changed to category
    });

  } catch (error) {
    log.error('Failed to update category', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update category',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: The MongoDB ObjectId of the category to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       400:
 *         description: Invalid category ID or category in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category in use"
 *                 message:
 *                   type: string
 *                   example: "Cannot delete category that is currently being used"
 *                 usedCount:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
// 5. Delete Category
router.delete('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category ID
    if (!categoryId || categoryId.length !== 24) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a valid MongoDB ObjectId'
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with the provided ID'
      });
    }

    // Check if category is being used (assuming you have a usedCount field)
    if (existingCategory.usedCount > 0) {
      return res.status(400).json({
        error: 'Category in use',
        message: 'Cannot delete category that is currently being used',
        usedCount: existingCategory.usedCount
      });
    }

    // Delete category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: 'Category deleted successfully'
    });

  } catch (error) {
    log.error('Failed to delete category', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete category',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/popular/top:
 *   get:
 *     summary: Get popular categories sorted by usage count
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of popular categories to return
 *     responses:
 *       200:
 *         description: Popular categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Popular categories retrieved successfully"
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       usedCount:
 *                         type: number
 *       500:
 *         description: Internal server error
 */
// 6. Get Popular Categories
router.get('/popular/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularCategories = await Category.find({})
      .sort({ usedCount: -1, name: 1 })
      .limit(parseInt(limit))
      .select('name usedCount');

    res.status(200).json({
      message: 'Popular categories retrieved successfully',
      categories: popularCategories // Changed to categories
    });

  } catch (error) {
    log.error('Failed to fetch popular categories', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch popular categories',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/categories/search/{query}:
 *   get:
 *     summary: Search categories by name or description
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (minimum 2 characters)
 *         example: "pol"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of categories to return
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
 *                   example: "Search completed successfully"
 *                 query:
 *                   type: string
 *                   example: "pol"
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       400:
 *         description: Invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid search query"
 *                 message:
 *                   type: string
 *                   example: "Search query must be at least 2 characters long"
 *       500:
 *         description: Internal server error
 */
// 7. Search Categories
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = { $regex: query, $options: 'i' };
    const categories = await Category.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    })
    .sort({ name: 1 })
    .limit(parseInt(limit))
    .select('name description');

    res.status(200).json({
      message: 'Search completed successfully',
      query,
      categories // Changed to categories
    });

  } catch (error) {
    log.error('Failed to search categories', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search categories',
      details: error.message
    });
  }
});

export default router;
