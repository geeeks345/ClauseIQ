const User = require('../models/User');
const Contract = require('../models/Contract');
const Analysis = require('../models/Analysis');
const History = require('../models/History');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    return ApiResponse.success(res, { users, total: users.length }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'legal_reviewer'].includes(role)) {
      return ApiResponse.error(res, 'Invalid role specified. Must be user, admin, or legal_reviewer', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    await History.create({
      userId: req.user._id,
      action: 'USER_ROLE_UPDATED',
      details: { targetUserId: user._id, newRole: role }
    });

    return ApiResponse.success(res, { user }, `User role updated to ${role}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return ApiResponse.error(res, 'You cannot delete your own admin account', 400);
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    return ApiResponse.success(res, null, 'User removed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get system-wide metrics (Admin only)
// @route   GET /api/v1/admin/metrics
// @access  Private (Admin)
exports.getAdminMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalContracts = await Contract.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    const recentAuditLogs = await History.find().sort('-createdAt').limit(20);

    const contracts = await Contract.find();
    const highRiskTotal = contracts.reduce((acc, c) => acc + (c.riskSummary?.highRiskCount || 0), 0);
    const medRiskTotal = contracts.reduce((acc, c) => acc + (c.riskSummary?.mediumRiskCount || 0), 0);
    const lowRiskTotal = contracts.reduce((acc, c) => acc + (c.riskSummary?.lowRiskCount || 0), 0);

    return ApiResponse.success(res, {
      totalUsers,
      totalContracts,
      totalAnalyses,
      riskOverview: {
        high: highRiskTotal,
        medium: medRiskTotal,
        low: lowRiskTotal,
      },
      recentAuditLogs,
    }, 'Admin system metrics retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all organization contracts (Admin only)
// @route   GET /api/v1/admin/contracts
// @access  Private (Admin)
exports.getAllContractsAdmin = async (req, res, next) => {
  try {
    const contracts = await Contract.find().populate('userId', 'name email').sort('-createdAt');
    return ApiResponse.success(res, { contracts, total: contracts.length }, 'All organizational contracts retrieved');
  } catch (error) {
    next(error);
  }
};
