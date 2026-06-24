import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// ─── Protect: verify JWT from HTTP-only cookie ──────────────────────────────
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user not found');
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error('Account has been deactivated');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized — invalid token');
  }
});

// ─── Admin Only: check roles array ──────────────────────────────────────────
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.roles.includes('admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied — admins only');
  }
});
