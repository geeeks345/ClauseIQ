const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const contractRoutes = require('./contractRoutes');
const aiRoutes = require('./aiRoutes');
const reportRoutes = require('./reportRoutes');
const notificationRoutes = require('./notificationRoutes');
const historyRoutes = require('./historyRoutes');
const healthRoutes = require('./healthRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/contracts', contractRoutes);
router.use('/ai', aiRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/history', historyRoutes);
router.use('/health', healthRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
