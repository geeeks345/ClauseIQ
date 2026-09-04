const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, clearAll } = require('../../controllers/notificationController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/', clearAll);

module.exports = router;
