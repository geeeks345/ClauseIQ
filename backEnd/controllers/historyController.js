const History = require('../models/History');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user activity logs
// @route   GET /api/v1/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const history = await History.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return ApiResponse.success(res, { history }, 'History retrieved');
});

// @desc    Clear activity history
// @route   DELETE /api/v1/history
// @access  Private
const clearHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({ userId: req.user._id });
  return ApiResponse.success(res, null, 'Activity history cleared');
});

module.exports = {
  getHistory,
  clearHistory
};
