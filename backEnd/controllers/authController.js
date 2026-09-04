const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const History = require('../models/History');
const Notification = require('../models/Notification');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'clauseiq_super_secure_jwt_production_secret_key_2026_x99!', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, company, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse.error(res, 'User already exists with this email', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    company: company || 'Enterprise Legal Team',
    role: role || 'user'
  });

  const token = generateToken(user._id);

  // Create welcome notification
  await Notification.create({
    userId: user._id,
    title: 'Welcome to ClauseIQ v1.0.0!',
    message: 'Start uploading contracts to identify critical risks, translate legal terms, and chat with AI.',
    type: 'info'
  });

  return ApiResponse.success(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        stats: user.stats
      },
      token
    },
    'User registered successfully',
    201
  );
});

// @desc    Login user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  return ApiResponse.success(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        stats: user.stats
      },
      token
    },
    'Login successful'
  );
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  return ApiResponse.success(res, { user }, 'User profile retrieved');
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, company, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  if (name) user.name = name;
  if (company) user.company = company;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return ApiResponse.success(res, { user }, 'Profile updated successfully');
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
