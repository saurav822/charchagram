import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * Verifies a JWT string against JWT_SECRET.
 *
 * @param {string} token - Raw JWT string
 * @returns {import('jsonwebtoken').JwtPayload} Decoded payload containing `userId`
 * @throws {Error} If JWT_SECRET is not configured or the token is invalid/expired
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('[auth] JWT_SECRET environment variable is not configured');
  }
  return jwt.verify(token, secret);
}

/**
 * Express middleware that authenticates requests using a JWT.
 *
 * Token resolution order:
 *   1. `jwtToken` HTTP-only cookie (set by the login endpoint)
 *   2. `Authorization: Bearer <token>` header (used by the SPA client)
 *
 * Attaches the full Mongoose User document to `req.user` on success.
 *
 * @type {import('express').RequestHandler}
 */
export const authenticateToken = async (req, res, next) => {
  // Prefer cookie-based token; fall back to Authorization header
  let token = req.cookies.jwtToken;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('[auth] Token verification failed:', error.message);
    return res.status(403).json({ error: 'Unauthorized - Invalid token' });
  }
};
