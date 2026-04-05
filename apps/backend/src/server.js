/**
 * @module server
 *
 * CharchaGram Express application entry point.
 *
 * Responsibilities:
 *  - Initialise middleware (helmet, CORS, morgan, cookie-parser, body-parser)
 *  - Mount all API route modules
 *  - Define core auth endpoints (login, logout, verify-otp)
 *  - Register the global error handler and 404 handler
 *  - Connect to MongoDB and start the HTTP server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import connectDB from './config/db.js';
import { rootLogger } from './utils/logger.js';
import { authenticateToken } from './middleware/auth.js';
import { handleOTPVerification } from './otherservices/msg91.js';
import { specs, swaggerUi } from './config/swagger.js';

// Route modules
import constituencyRoutes from './routes/constituencies.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import blogRoutes from './routes/blog.js';
import emailRoutes from './routes/email.js';

// Model side-effects: registering schemas with Mongoose so populate() works
// across all route files regardless of import order.
import './models/constituency.js';
import './models/post.js';
import './models/comment.js';
import './models/category.js';
import './models/blog.js';
import User from './models/user.js';

dotenv.config();

// ── Zod validation schemas ────────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/users/create.
 * Mirrors the field constraints enforced by the Mongoose UserSchema.
 */
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  constituency: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional().nullable(),
  ageBracket: z.string().optional(),
  gender: z.string().optional(),
});

// ── App bootstrap ─────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3000;

/** JWT token lifetime in milliseconds (30 days). */
const JWT_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000;

// Connect to MongoDB — exits the process if MONGO_URI is unset or unreachable.
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(helmet());
app.use(
  cors({
    // origin: true allows all origins.  Tighten to FRONTEND_DEPLOY_URL in prod
    // by switching to the function-based origin check in ARCHITECTURE.md §3.
    origin: true,
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Swagger / API docs ────────────────────────────────────────────────────────

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CharchaGram API Documentation',
  })
);

// ── Utility helpers ───────────────────────────────────────────────────────────

/**
 * Signs a JWT for the given user ID.
 *
 * @param {string} userId - MongoDB ObjectId string
 * @returns {string} Signed JWT with a 30-day expiry
 * @throws {Error} If JWT_SECRET is not configured
 */
function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('[server] JWT_SECRET environment variable is not configured');
  }
  return jwt.sign({ userId }, secret, { expiresIn: '30d' });
}

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API route modules ─────────────────────────────────────────────────────────

app.use('/api/constituencies', constituencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/email', emailRoutes);

// ── Auth endpoints ────────────────────────────────────────────────────────────

/**
 * POST /login
 *
 * Authenticates a user by phone number and issues a JWT cookie.
 * No password — authentication is via MSG91 OTP (handled by /api/verify-otp).
 *
 * @body {{ phoneNumber: string }}
 */
app.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber?.trim() });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const token = generateToken(user._id.toString());

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: JWT_COOKIE_MAX_AGE_MS,
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    rootLogger.error('POST /login failed', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/users/create
 *
 * Creates a new user account after OTP verification.
 * Validates input with Zod before touching the database.
 *
 * @body {CreateUserRequest}
 */
app.post('/api/users/create', async (req, res) => {
  try {
    const validationResult = createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: validationResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    const existingUser = await User.findOne({ phoneNumber: validatedData.phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this phone number already exists',
      });
    }

    const newUser = new User({
      ...validatedData,
      phoneNumber: validatedData.phoneNumber.trim(),
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id.toString());

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: JWT_COOKIE_MAX_AGE_MS,
    });

    const populatedUser = await User.findById(savedUser._id).populate('constituency', 'area_name');

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: populatedUser,
    });
  } catch (error) {
    rootLogger.error('POST /api/users/create failed', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user',
    });
  }
});

/**
 * GET /api/auth/ping
 *
 * Returns the authenticated user's profile.  Used by the frontend to verify
 * that a stored token is still valid on page load.
 */
app.get('/api/auth/ping', authenticateToken, (req, res) => {
  return res.status(200).json({ message: 'Authenticated', user: req.user });
});

/**
 * POST /api/auth/logout
 *
 * Clears the JWT cookie.  The client should also remove the token from localStorage.
 */
app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('jwtToken');
  return res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * POST /api/verify-otp
 *
 * Delegates OTP verification to the MSG91 service handler.
 */
app.post('/api/verify-otp', handleOTPVerification);

// ── Root endpoint ─────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    message: 'CharchaGram Backend API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// ── Global error handler ──────────────────────────────────────────────────────

/**
 * Centralized error handler — catches errors forwarded via next(err).
 *
 * Handles:
 *  - Mongoose ValidationError → 400 with field-level detail
 *  - Mongoose duplicate key (code 11000) → 400 with field name
 *  - Everything else → 500 (message hidden in production)
 *
 * @type {import('express').ErrorRequestHandler}
 */
app.use((err, _req, res, _next) => {
  rootLogger.error('Unhandled error', err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
    return res.status(400).json({ error: 'Validation Error', details });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Error',
      message: `${field} already exists`,
      field,
      value: err.keyValue[field],
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'production' ? 'Something went wrong on the server' : err.message,
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
  });
});

// ── Start server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  rootLogger.info(`Server running on port ${PORT}`);
  rootLogger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  rootLogger.info(`Health check: http://localhost:${PORT}/health`);
  rootLogger.info(`API docs:     http://localhost:${PORT}/api-docs`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  rootLogger.info('SIGTERM received — shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  rootLogger.info('SIGINT received — shutting down gracefully');
  process.exit(0);
});

export default app;
