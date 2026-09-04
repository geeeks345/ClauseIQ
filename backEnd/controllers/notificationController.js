const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    read: false
  });

  return ApiResponse.success(res, { notifications, unreadCount }, 'Notifications retrieved');
});

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return ApiResponse.error(res, 'Notification not found', 404);
  }

  return ApiResponse.success(res, { notification }, 'Notification marked as read');
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  return ApiResponse.success(res, null, 'All notifications marked as read');
});

// @desc    Clear all notifications
// @route   DELETE /api/v1/notifications
// @access  Private
const clearAll = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  return ApiResponse.success(res, null, 'All notifications cleared');
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll
};
