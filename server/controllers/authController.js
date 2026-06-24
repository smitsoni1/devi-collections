import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// ─── @desc  Register new user
// ─── @route POST /api/auth/register
// ─── @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ─── @desc  Login user
// ─── @route POST /api/auth/login
// ─── @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ─── @desc  Logout user (clear cookie)
// ─── @route POST /api/auth/logout
// ─── @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── @desc  Get current user profile
// ─── @route GET /api/auth/profile
// ─── @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ─── @desc  Update current user profile
// ─── @route PUT /api/auth/profile
// ─── @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.body.addresses) {
    user.addresses = req.body.addresses;
  }

  const updated = await user.save();

  generateToken(res, updated._id); // refresh token

  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      roles: updated.roles,
      isAdmin: updated.isAdmin,
      addresses: updated.addresses,
    },
  });
});
