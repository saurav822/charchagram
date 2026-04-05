import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Constituency from '../models/constituency.js';
import { getConstituencyByAreaName, getAllConstituencyNames } from '../utils/constituencyData.js';
import { constituencyArraySchema, constituencySchema } from '../schema/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

// Apply middleware to all admin routes
// router.use('/admin', authenticateAdmin);

// Validation middleware
const validateAreaName = [
  param('area_name')
    .trim()
    .notEmpty()
    .withMessage('Area name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Area name must be between 1 and 100 characters')
    .escape()
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * /api/constituencies:
 *   get:
 *     summary: Get all constituency area names
 *     description: Returns a list of all constituency area names for dropdown selection
 *     tags: [Constituencies]
 *     responses:
 *       200:
 *         description: List of constituencies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   area_name:
 *                     type: string
 *                     example: "Raghopur Vidhan Sabha Kshetra"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    // First try to get from database
    let constituencies = await Constituency.getAllAreaNames();

    res.status(200).json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    // Fallback to sample data

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch constituencies'
    });
  }
});

/**
 * @swagger
 * /api/constituencies/{area_name}:
 *   get:
 *     summary: Get constituency details by area name
 *     description: Returns complete information for a specific constituency including representative details, departments, and candidates
 *     tags: [Constituencies]
 *     parameters:
 *       - in: path
 *         name: area_name
 *         required: true
 *         schema:
 *           type: string
 *         description: URL-encoded constituency name
 *         example: "Raghopur%20Vidhan%20Sabha%20Kshetra"
 *     responses:
 *       200:
 *         description: Constituency details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Constituency'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Constituency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:area_name', validateAreaName, handleValidationErrors, async (req, res) => {
  try {
    const { area_name } = req.params;

    // Decode URL-encoded area name
    const decodedAreaName = decodeURIComponent(area_name);

    // First try to get from database
    let constituency;
    try {
      constituency = await Constituency.findByAreaName(decodedAreaName);
    }
    catch (err) {
      return res.status(404).json({
        error: 'Constituency not found',
        message: `No constituency found with area name: ${decodedAreaName}`,
        requested_area: decodedAreaName
      });
    }

    if (!constituency) {
      return res.status(404).json({
        error: 'Constituency not found',
        message: `No constituency found with area name: ${decodedAreaName}`,
        requested_area: decodedAreaName
      });
    }
    console.log('constituency.vidhayak_info ', constituency.vidhayak_info)

    res.status(200).json({
      area_name: constituency.area_name,
      vidhayak_info: constituency.vidhayak_info,
      dept_info: constituency.dept_info,
      other_candidates: constituency.other_candidates
    });
  } catch (error) {
    console.error('Error fetching constituency:', error);

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch constituency details'
    });
  }
});


/**
 * @swagger
 * /api/constituencies/id/{id}:
 *   get:
 *     summary: Get constituency by ID
 *     description: Retrieve detailed information about a specific constituency using its MongoDB ObjectId
 *     tags: [Constituencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the constituency
 *         example: "68a44a6c83ff6cc40618822b"
 *     responses:
 *       200:
 *         description: Constituency found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: MongoDB ObjectId of the constituency
 *                   example: "68a44a6c83ff6cc40618822b"
 *                 area_name:
 *                   type: string
 *                   description: Name of the constituency area
 *                   example: "Raghopur Vidhan Sabha Kshetra"
 *                 vidhayak_info:
 *                   $ref: '#/components/schemas/VidhayakInfo'
 *                 dept_info:
 *                   type: array
 *                   description: Array of department information
 *                   items:
 *                     $ref: '#/components/schemas/DeptInfo'
 *                 other_candidates:
 *                   type: array
 *                   description: Array of other candidates in the constituency
 *                   items:
 *                     $ref: '#/components/schemas/OtherCandidate'
 *                 latest_news:
 *                   type: array
 *                   description: Array of latest news items
 *                   items:
 *                     $ref: '#/components/schemas/LatestNews'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the constituency was created
 *                   example: "2025-08-19T10:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the constituency was last updated
 *                   example: "2025-08-19T10:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     examples:
 *       success:
 *         summary: Successful response
 *         value:
 *           _id: "68a44a6c83ff6cc40618822b"
 *           area_name: "Raghopur Vidhan Sabha Kshetra"
 *           vidhayak_info:
 *             name: "तेजस्वी यादव"
 *             age: 58
 *             party_name: "RJD"
 *           dept_info:
 *             - id: "dept-001"
 *               dept_name: "स्वास्थ्य"
 *           other_candidates:
 *             - id: 1
 *               candidate_name: "राहुल शर्मा"
 *               candidate_party: "Congress"
 *           latest_news:
 *             - title: "तेजस्वी यादव ने स्वास्थ्य केंद्र का उद्घाटन किया"
 *           createdAt: "2025-08-19T10:00:00.000Z"
 *           updatedAt: "2025-08-19T10:00:00.000Z"
 */
router.get('/id/:id', async (req, res) => {
  try {
    const constituencyId = req.params.id;
    const constituency = await Constituency.findById(constituencyId);
    res.status(200).json({
      _id: constituency._id,
      area_name: constituency.area_name,
      vidhayak_info: constituency.vidhayak_info,
      dept_info: constituency.dept_info,
      other_candidates: constituency.other_candidates,
      latest_news: constituency.latest_news,
      createdAt: constituency.createdAt,
      updatedAt: constituency.updatedAt
    });
  }
  catch (error) {
    console.error('Error fetching constituency:', error);
    res.status(500).json({
      error: `Internal server error ${error}`,
      message: 'Failed to fetch constituency details'
    });
  }
})
/**
 * @swagger
 * /api/constituencies/list/paginated:
 *   get:
 *     summary: Get all constituencies with pagination
 *     description: Returns all constituencies with pagination support, 2 results per page
 *     tags: [Constituencies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 2
 *           minimum: 1
 *           maximum: 10
 *         description: Number of constituencies per page
 *     responses:
 *       200:
 *         description: Constituencies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 constituencies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Constituency'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     totalConstituencies:
 *                       type: integer
 *                       example: 4
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/list/paginated', async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    console.log('called this endpoint 9090')
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = 'desc';
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count of constituencies
    const totalConstituencies = await Constituency.countDocuments({});

    // If no constituencies found, return empty result
    if (totalConstituencies === 0) {
      return res.status(200).json({
        constituencies: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalConstituencies: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null
        }
      });
    }

    // Use aggregation to get constituencies with post counts and survey votes
    const constituenciesWithStats = await Constituency.aggregate([
      // Step 1: Lookup posts for each constituency
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'constituency',
          as: 'posts'
        }
      },
      // Step 2: Calculate totalPosts and totalSurveyVotes
      {
        $addFields: {
          totalPosts: { $size: '$posts' },
          totalSurveyVotes: {
            $reduce: {
              input: { $ifNull: ['$vidhayak_info.survey_score', []] },
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  { $size: { $ifNull: ['$$this.yes_votes', []] } },
                  { $size: { $ifNull: ['$$this.no_votes', []] } }
                ]
              }
            }
          }
        }
      },
      // Step 3: Calculate sortScore
      {
        $addFields: {
          sortScore: { $add: ['$totalPosts', '$totalSurveyVotes'] }
        }
      },
      // Step 4: Remove the posts array (we only needed it for counting)
      {
        $project: {
          posts: 0
        }
      },
      // Step 5: Sort by sortScore descending, then area_name ascending
      {
        $sort: {
          sortScore: -1,
          area_name: 1
        }
      }
    ]);    
    constituenciesWithStats.slice(0, 3).forEach((constituency, index) => {
      console.log(`${index + 1}. ${constituency.area_name} - Posts: ${constituency.totalPosts}, Survey Votes: ${constituency.totalSurveyVotes}, Sort Score: ${constituency.sortScore}`);
    });

    // Apply pagination
    const paginatedConstituencies = constituenciesWithStats.slice(skip, skip + limit);

    // Calculate total pages
    const totalPages = Math.ceil(constituenciesWithStats.length / limit);

    // Check if requested page is valid
    if (page > totalPages) {
      return res.status(400).json({
        error: 'Page out of range',
        message: `Page ${page} does not exist. Total pages: ${totalPages}`
      });
    }

    // Calculate pagination metadata
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    // Prepare response
    const response = {
      constituencies: paginatedConstituencies,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalConstituencies: constituenciesWithStats.length,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: nextPage,
        prevPage: prevPage,
        limit: limit
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching all constituencies:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch all constituencies'
    });
  }
});

/**
 * @swagger
 * /api/constituencies/poll/{area_name}:
 *   post:
 *     summary: Submit poll response for constituency
 *     description: Submit poll response for either vidhayak survey or department survey
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: area_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Constituency area name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - poll_response
 *               - poll_category
 *               - question_id
 *             properties:
 *               poll_response:
 *                 type: string
 *                 enum: ["yes", "no"]
 *                 description: User's poll response
 *               poll_category:
 *                 type: string
 *                 enum: ["vidhayak", "department"]
 *                 description: Category of the poll
 *               question_id:
 *                 type: string
 *                 description: ID of the question being answered
 *               dept_id:
 *                 type: string
 *                 description: Department ID (required only for department polls)
 *     responses:
 *       200:
 *         description: Poll response recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poll response recorded successfully"
 *                 updated_scores:
 *                   type: object
 *                   properties:
 *                     yes_votes:
 *                       type: number
 *                     no_votes:
 *                       type: number
 *                     score:
 *                       type: number
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Constituency or department not found
 *       500:
 *         description: Internal server error
 */
router.post('/poll/:area_name', authenticateToken, async (req, res) => {
  try {
    const { area_name } = req.params;
    const user = req.user;
    const { poll_response, poll_category, question_id, dept_id } = req.body;
    
    const userIdString = user._id.toString();

    // Find the constituency
    const constituency = await Constituency.findOne({ area_name: area_name });

    if (!constituency) {
      return res.status(404).json({
        error: 'Constituency not found',
        message: `No constituency found with area name: ${area_name}`
      });
    }

    let updatedScores = {};

    // Handle poll response based on category
    switch (poll_category) {
      case 'vidhayak':
        // Find the question by question_id (using index for simplicity)
        const questionIndex = parseInt(question_id);

        // Get the current question state
        const currentQuestion = constituency.vidhayak_info.survey_score[questionIndex];

        // Convert user._id to string to ensure type consistency

        // Create new arrays for the updated question (convert all IDs to strings)
        let newYesVotes = currentQuestion.yes_votes.map(id => id.toString());
        let newNoVotes = currentQuestion.no_votes.map(id => id.toString());
        // Update votes
        if (poll_response === 'yes') {
          newNoVotes = newNoVotes.filter(vote => vote !== userIdString);

          // Add to yes_votes only if not already there
          if (!newYesVotes.includes(userIdString)) {
            newYesVotes.push(userIdString);
          }
        } else {
          // Remove from yes_votes if they're there
          newYesVotes = newYesVotes.filter(vote => vote !== userIdString);

          // Add to no_votes only if not already there
          if (!newNoVotes.includes(userIdString)) {
            newNoVotes.push(userIdString);
          }
        }

        // Calculate new score
        const totalVotes = newYesVotes.length + newNoVotes.length;
        const newScore = totalVotes > 0 ? Math.round((newYesVotes.length / totalVotes) * 100) : 0;

        // Create updated question object - preserve ALL original fields
        const updatedQuestion = {
          question: currentQuestion.question, // Explicitly preserve the question field
          yes_votes: newYesVotes,
          no_votes: newNoVotes,
          score: newScore
        };

        // Update the constituency object directly
        constituency.vidhayak_info.survey_score[questionIndex] = updatedQuestion;

        updatedScores = {
          yes_votes: newYesVotes,
          no_votes: newNoVotes,
          question_score: newScore
        };

        break;

      case 'dept':
        // Validate dept_id for department polls
        if (!dept_id) {
          return res.status(400).json({
            error: 'Department ID required',
            message: 'dept_id is required for department polls'
          });
        }

        // Validate poll_response is between 1 and 5 for rating system
        const rating = parseInt(poll_response);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return res.status(400).json({
            error: 'Invalid poll response',
            message: 'poll_response must be a number between 1 and 5 for department polls'
          });
        }

        // Find the department
        const department = constituency.dept_info.find(dept => dept.id === dept_id);

        if (!department) {
          return res.status(404).json({
            error: 'Department not found',
            message: `No department found with ID: ${dept_id}`
          });
        }

        // Find the question by question_id
        const deptQuestionIndex = parseInt(question_id);
        if (isNaN(deptQuestionIndex) || deptQuestionIndex < 0 || deptQuestionIndex >= department.survey_score.length) {
          return res.status(400).json({
            error: 'Invalid question ID',
            message: 'Question ID is out of range'
          });
        }

        const deptQuestion = department.survey_score[deptQuestionIndex];

        // Initialize ratings object if not present
        if (!deptQuestion.ratings) {
          deptQuestion.ratings = { "1": [], "2": [], "3": [], "4": [], "5": [] };
        }
        //remove the user's id from the ratings array
        Object.keys(deptQuestion.ratings).forEach(ratingKey => {
          deptQuestion.ratings[ratingKey] = deptQuestion.ratings[ratingKey].filter(userId => userId !== userIdString);
        });

        // Update ratings
        deptQuestion.ratings[rating.toString()].push(userIdString);

        // Calculate the weighted average of the ratings using array lengths
        const totalVotesDept = Object.values(deptQuestion.ratings).reduce((sum, userArray) => sum + userArray.length, 0);
        const weightedSum = Object.entries(deptQuestion.ratings).reduce(
          (sum, [star, userArray]) => sum + (parseInt(star) * userArray.length), 0
        );
        const weightedAverage = totalVotesDept > 0 ? weightedSum / totalVotesDept : 0;


        // 2. calculate the average score of the department. store it in department.average_score
        // First, update the current question's score
        deptQuestion.score = Math.round(((weightedAverage - 1) / 4) * 100);

        // Then calculate the overall department average from all its questions
        let deptTotalScore = 0;
        let questionCount = 0;

        department.survey_score.forEach(question => {
          if (question.score > 0) {
            deptTotalScore += question.score;
            questionCount += 1;
          }
        });

        // Store the department's overall average score
        department.average_score = questionCount > 0
          ? Math.round(deptTotalScore / questionCount)
          : 0;

        // 3. calculate the manifesto score of the constituency = average of all department average scores. store it in constituency.vidhayak_info.manifesto_score
        let totalDeptScores = 0;
        let deptCount = 0;

        constituency.dept_info.forEach(dept => {
          if (dept.average_score > 0) {
            totalDeptScores += dept.average_score;
            deptCount += 1;
          }
        });

        // Update constituency manifesto score
        constituency.vidhayak_info.manifesto_score = deptCount > 0
          ? Math.round(totalDeptScores / deptCount)
          : 0;

        // 4. update the constituency with the new scores.
        // (Already done above - deptQuestion.score, department.average_score, and constituency.vidhayak_info.manifesto_score)

        // 5. save the constituency to the database.
        // (This will be done after the switch statement with await constituency.save())

        // 6. return the updated department.average_score.
        updatedScores = {
          ratings: deptQuestion.ratings,
          question_score: deptQuestion.score,
          department_average_score: department.average_score,
          manifesto_score: constituency.vidhayak_info.manifesto_score
        };

        break;

      default:
        return res.status(400).json({
          error: 'Invalid poll category',
          message: 'poll_category must be either "vidhayak" or "department"'
        });
    }

    // Save the updated constituency to database
    await constituency.save();

    res.status(200).json({
      message: 'Poll response recorded successfully',
      constituency: area_name,
      poll_category: poll_category,
      question_id: question_id,
      poll_response: poll_response,
      updated_scores: updatedScores
    });

  } catch (error) {
    console.error('Error recording poll response:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record poll response'
    });
  }
});

/**
 * @swagger
 * /api/constituencies/stats/overview:
 *   get:
 *     summary: Get constituency statistics overview
 *     description: Returns overview statistics of all constituencies including total count, parties, and departments
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_constituencies:
 *                   type: number
 *                   example: 4
 *                 parties:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["RJD", "BJP", "Congress", "JDU"]
 *                 total_departments:
 *                   type: number
 *                   example: 16
 *                 satisfaction_average:
 *                   type: string
 *                   example: "68%"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const constituencies = await Constituency.find({});

    if (!constituencies || constituencies.length === 0) {
      // Use sample data for statistics
      const sampleData = getAllConstituencyNames();
      const stats = {
        total_constituencies: sampleData.length,
        parties: ['RJD', 'BJP', 'Congress', 'JDU'],
        total_departments: 16, // 4 constituencies × 4 departments each
        satisfaction_average: "68%"
      };
      return res.json(stats);
    }

    const stats = {
      total_constituencies: constituencies.length,
      parties: [...new Set(constituencies.map(c => c.vidhayak_info.party_name))],
      total_departments: constituencies.reduce((sum, c) => sum + c.dept_info.length, 0),
      satisfaction_average: "68%"
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching constituency stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch constituency statistics'
    });
  }
});

//these are admin APIs, so we need to add a middleware to check if the user is admin.
//need a login API, with admin credentials, and a token will be returned, which will be used to authenticate the admin in the other APIs.
//API to add a new constituency data to the DB
//API to delete a constituency data from the DB
//API to update a constituency data in the DB
//API to clean the DB, and populate it with sample data of all constituencies at once.
/**
 * @swagger
 * /api/constituencies/admin/constituencies/delete/{id}:
 *   delete:
 *     summary: Delete a constituency by ID
 *     description: Admin endpoint to permanently delete a constituency and all associated data
 *     tags: [Admin]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the constituency to delete
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Constituency deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Constituency deleted successfully"
 *                 deleted_constituency:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     area_name:
 *                       type: string
 *                       example: "Raghopur Vidhan Sabha Kshetra"
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID format"
 *                 message:
 *                   type: string
 *                   example: "Constituency ID must be a valid MongoDB ObjectId"
 *       401:
 *         description: Unauthorized - Admin token required
 *       404:
 *         description: Constituency not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Constituency not found"
 *                 message:
 *                   type: string
 *                   example: "No constituency found with ID: 64f8a1b2c3d4e5f6a7b8c9d0"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Failed to delete constituency"
 *                 details:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.delete('/admin/constituencies/delete/:id', async (req, res) => {
  try {
    const constituencyId = req.params.id;

    // Validate the ID format
    if (!constituencyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'Constituency ID must be a valid MongoDB ObjectId'
      });
    }

    // Check if constituency exists
    const constituency = await Constituency.findById(constituencyId);

    if (!constituency) {
      return res.status(404).json({
        error: 'Constituency not found',
        message: `No constituency found with ID: ${constituencyId}`
      });
    }

    // Delete the constituency
    await Constituency.findByIdAndDelete(constituencyId);

    console.log(`Successfully deleted constituency: ${constituency.area_name}`);

    res.status(200).json({
      message: 'Constituency deleted successfully',
      deleted_constituency: {
        id: constituencyId,
        area_name: constituency.area_name
      }
    });
  } catch (error) {
    console.error('Error in delete operation:', error);

    let errorMessage = 'Failed to delete constituency';
    let errorDetails = {};

    if (error.name === 'CastError') {
      errorMessage = 'Invalid constituency ID';
      errorDetails = {
        field: 'id',
        message: 'The provided ID is not a valid MongoDB ObjectId'
      };
    }

    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
});
/**
 * @swagger
 * /api/constituencies/admin/constituencies/update/{id}:
 *   put:
 *     summary: Update existing constituency
 *     description: Admin endpoint to update an existing constituency by ID
 *     tags: [Admin]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the constituency to update
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Constituency'
 *     responses:
 *       200:
 *         description: Constituency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Constituency updated successfully"
 *                 constituency:
 *                   $ref: '#/components/schemas/Constituency'
 *       400:
 *         description: Validation failed or invalid ID
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
 *                   example: "Input data does not match required schema"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *                       received:
 *                         type: any
 *       401:
 *         description: Unauthorized - Admin token required
 *       404:
 *         description: Constituency not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Constituency not found"
 *                 message:
 *                   type: string
 *                   example: "No constituency found with ID: 64f8a1b2c3d4e5f6a7b8c9d0"
 *       409:
 *         description: Area name conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Area name conflict"
 *                 message:
 *                   type: string
 *                   example: "Constituency with area name 'Raghopur Vidhan Sabha Kshetra' already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Failed to update constituency"
 *                 details:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.put('/admin/constituencies/update/:id', async (req, res) => {
  try {
    const constituencyObject = req.body;
    const constituencyId = req.params.id;

    // Validate the input using Zod schema
    const validationResult = constituencySchema.safeParse(constituencyObject);

    if (!validationResult.success) {
      // const errors = validationResult.error.map(err => ({
      //   field: err.path.join('.'),
      //   message: err.message,
      //   received: err.received
      // }));

      return res.status(400).json({
        error: 'Validation failed',
        message: 'Input data does not match required schema',
        details: validationResult.error
      });
    }

    const validatedConstituency = constituencyObject;

    // Check if constituency exists
    const existingConstituency = await Constituency.findById(constituencyId);

    if (!existingConstituency) {
      return res.status(404).json({
        error: 'Constituency not found',
        message: `No constituency found with ID: ${constituencyId}`
      });
    }

    // Check if area_name is being changed and if it conflicts with existing constituency
    if (constituencyObject.area_name &&
      constituencyObject.area_name !== existingConstituency.area_name) {
      const conflictingConstituency = await Constituency.findOne({
        area_name: constituencyObject.area_name
      });

      if (conflictingConstituency) {
        return res.status(409).json({
          error: 'Area name conflict',
          message: `Constituency with area name '${constituencyObject.area_name}' already exists`
        });
      }
    }

    // Process department IDs to ensure they are unique UUIDs
    if (constituencyObject.dept_info) {
      constituencyObject.dept_info = constituencyObject.dept_info.map(dept => ({
        ...dept,
        id: dept.id || uuidv4()
      }));
    }

    // Update the constituency with the new data
    const updatedConstituency = await Constituency.findByIdAndUpdate(
      constituencyId,
      constituencyObject,
      {
        new: true,
        runValidators: true,
        maxTimeMS: 30000
      }
    );

    console.log(`Successfully updated constituency: ${updatedConstituency.area_name}`);

    res.status(200).json({
      message: 'Constituency updated successfully',
      constituency: updatedConstituency
    });

  } catch (error) {
    console.error('Error in update operation:', error);

    let errorMessage = 'Failed to update constituency';
    let errorDetails = {};

    if (error.name === 'ValidationError') {
      errorMessage = 'Data validation failed';
      errorDetails = {
        field: error.errors ? Object.keys(error.errors) : [],
        message: error.message
      };
    } else if (error.name === 'MongoError' || error.code === 11000) {
      errorMessage = 'Duplicate area name';
      errorDetails = {
        code: error.code,
        message: 'Constituency with this area name already exists'
      };
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid constituency ID';
      errorDetails = {
        field: 'id',
        message: 'The provided ID is not a valid MongoDB ObjectId'
      };
    }

    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
});
/**
 * @swagger
 * /api/constituencies/admin/constituencies/add:
 *   post:
 *     summary: Add a new constituency
 *     description: Admin endpoint to add a new constituency to the database
 *     tags: [Admin]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Constituency'
 *     responses:
 *       201:
 *         description: Constituency added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Constituency added successfully"
 *                 constituency:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     area_name:
 *                       type: string
 *                       example: "Raghopur Vidhan Sabha Kshetra"
 *                     vidhayak_info:
 *                       type: object
 *                     dept_count:
 *                       type: number
 *                       example: 4
 *                     other_candidates_count:
 *                       type: number
 *                       example: 3
 *                     latest_news_count:
 *                       type: number
 *                       example: 2
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
 *                   example: "Input data does not match required schema"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *                       received:
 *                         type: any
 *       401:
 *         description: Unauthorized - Admin token required
 *       409:
 *         description: Constituency already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Constituency already exists"
 *                 message:
 *                   type: string
 *                   example: "Constituency with area name 'Raghopur Vidhan Sabha Kshetra' already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Failed to add constituency"
 *                 details:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.post('/admin/constituencies/add', async (req, res) => {
  try {
    const constituencyObject = req.body;

    // Validate the input using Zod schema
    const validationResult = constituencySchema.safeParse(constituencyObject);
    console.log("validationResult ", validationResult)
    if (!validationResult.success) {
      // const errors = validationResult.error.map(err => ({
      //   field: err.path.join('.'),
      //   message: err.message,
      //   received: err.received
      // }));

      return res.status(400).json({
        error: 'Validation failed',
        message: 'Input data does not match required schema',
        details: validationResult.error
      });
    }

    const validatedConstituency = constituencyObject;

    // Check if constituency with same area_name already exists
    const existingConstituency = await Constituency.findOne({
      area_name: validatedConstituency.area_name
    });

    if (existingConstituency) {
      return res.status(409).json({
        error: 'Constituency already exists',
        message: `Constituency with area name '${validatedConstituency.area_name}' already exists`
      });
    }

    // Process department IDs to ensure they are unique UUIDs
    const processedConstituency = {
      ...validatedConstituency,
      dept_info: validatedConstituency.dept_info.map(dept => ({
        ...dept,
        id: dept.id || uuidv4()
      })),
      other_candidates: validatedConstituency.other_candidates.map(candidate => ({
        ...candidate,
        id: candidate.id || uuidv4()
      }))
    };

    // Insert the new constituency
    const newConstituency = new Constituency(processedConstituency);
    const savedConstituency = await newConstituency.save();

    console.log(`Successfully added new constituency: ${savedConstituency.area_name}`);

    res.status(201).json({
      message: 'Constituency added successfully',
      constituency: {
        id: savedConstituency._id,
        area_name: savedConstituency.area_name,
        vidhayak_info: savedConstituency.vidhayak_info,
        dept_count: savedConstituency.dept_info.length,
        other_candidates_count: savedConstituency.other_candidates.length,
        latest_news_count: savedConstituency.latest_news.length
      }
    });

  } catch (error) {
    console.error('Error in add operation:', error);

    let errorMessage = 'Failed to add constituency';
    let errorDetails = {};

    if (error.name === 'ValidationError') {
      errorMessage = 'Data validation failed';
      errorDetails = {
        field: error.errors ? Object.keys(error.errors) : [],
        message: error.message
      };
    } else if (error.name === 'MongoError' || error.code === 11000) {
      errorMessage = 'Duplicate constituency';
      errorDetails = {
        code: error.code,
        message: 'Constituency with this area name already exists'
      };
    }

    res.status(500).json({
      error: `Internal server error ${error}`,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/constituencies/admin/constituencies/reset-populate:
 *   post:
 *     summary: Reset and populate database
 *     description: Admin endpoint to reset the database and populate it with new constituency data
 *     tags: [Admin]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Constituency'
 *             minItems: 1
 *             description: Array of constituency objects to populate the database with
 *     responses:
 *       200:
 *         description: Database reset and populated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully reset and populated the database with 6 constituencies"
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_constituencies:
 *                       type: number
 *                       example: 6
 *                     deleted_constituencies:
 *                       type: number
 *                       example: 0
 *                     inserted_constituencies:
 *                       type: number
 *                       example: 6
 *                     constituencies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           area_name:
 *                             type: string
 *                           vidhayak_info:
 *                             type: object
 *                           dept_info:
 *                             type: array
 *                           other_candidates:
 *                             type: array
 *                           id:
 *                             type: string
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
 *                   example: "Input data does not match required schema"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *                       received:
 *                         type: any
 *       401:
 *         description: Unauthorized - Admin token required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Failed to reset and populate database"
 *                 details:
 *                   type: object
 *      
 */
router.post('/admin/constituencies/reset-populate', async (req, res) => {
  try {
    let constituencyArrayJavascriptObject = req.body;

    // Check if the request is raw JavaScript object syntax
    let constituencyArray = constituencyArrayJavascriptObject
    if (!Array.isArray(constituencyArrayJavascriptObject)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'The JSON input must be an array of constituencies',
        details: []
      });
    }
    // console.log('constituencyArray ', constituencyArray)
    // Validate the input array of constituencies
    const validationResult = constituencyArraySchema.safeParse(constituencyArray);

    // console.log("validationResult ", validationResult)
    if (!validationResult.success) {
      console.log("validationResult ", validationResult)
      // const errors = validationResult.error.map(err => ({
      //   field: err.path.join('.'),
      //   message: err.message,
      //   received: err.received
      // }));

      return res.status(400).json({
        error: `Validation failed with error:`,
        message: 'Input data does not match required schema',
        details: validationResult.error
      });
    }

    // const validatedConstituencies = validationResult.data;

    // console.log(`Starting database reset and populate with ${validatedConstituencies.length} constituencies...`);

    // Step 1: Delete all existing constituencies
    console.log('Deleting existing constituencies...');
    const deleteResult = await Constituency.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing constituencies`);

    // Step 2: Populate with new constituency data
    console.log('Populating database with new constituencies...');

    // Process each constituency to ensure proper UUIDs for departments
    const processedConstituencies = constituencyArray.map(constituency => {
      // Ensure each department has a unique UUID
      const processedDeptInfo = constituency.dept_info.map(dept => ({
        ...dept,
        id: uuidv4() // Use existing ID or generate new one
      }));
      const processedOtherCandidates = constituency.other_candidates.map(candidate => ({
        ...candidate,
        id: uuidv4()
      }));
      return {
        ...constituency,
        dept_info: processedDeptInfo,
        other_candidates: processedOtherCandidates
      };
    });

    // Insert all constituencies
    const insertResults = await Constituency.insertMany(processedConstituencies, {
      maxTimeMS: 30000 // 30 second timeout
    });

    // console.log(`Successfully inserted ${insertResults.length} constituencies`);

    // Step 3: Verify the population
    const totalCount = await Constituency.countDocuments();
    console.log(`Total constituencies in database: ${totalCount}`);

    // Step 4: Return success response
    res.status(200).json({
      message: `Successfully reset and populated the database with ${totalCount} constituencies`,
      summary: {
        total_constituencies: totalCount,
        deleted_constituencies: deleteResult.deletedCount,
        inserted_constituencies: insertResults.length,
        constituencies: insertResults.map(c => ({
          area_name: c.area_name,
          vidhayak_info: c.vidhayak_info,
          dept_info: c.dept_info,
          other_candidates: c.other_candidates,
          id: c._id
        }))
      }
    });

  } catch (error) {
    console.error('Error in reset-populate operation:', error);

    // Provide detailed error information
    let errorMessage = 'Failed to reset and populate database';
    let errorDetails = {};

    if (error.name === 'ValidationError') {
      errorMessage = 'Data validation failed';
      errorDetails = {
        field: error.errors ? Object.keys(error.errors) : [],
        message: error.message
      };
    } else if (error.name === 'MongoError' || error.code === 11000) {
      errorMessage = 'Database operation failed';
      errorDetails = {
        code: error.code,
        message: error.message
      };
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Database operation timed out';
      errorDetails = {
        operation: 'insertMany',
        timeout: '30 seconds'
      };
    }

    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
});
// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    available_routes: [
      'GET /api/constituencies',
      'GET /api/constituencies/:area_name',
      'GET /api/constituencies/stats/overview'
    ]
  });
});

export default router;
