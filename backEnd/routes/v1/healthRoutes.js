const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AIClient = require('../../services/aiClient');

router.get('/', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const aiHealth = await AIClient.checkHealth();

  res.status(200).json({
    status: 'online',
    version: 'v1.0.0',
    service: 'ClauseIQ Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dependencies: {
      database: {
        status: dbStatus,
        host: mongoose.connection.host || '127.0.0.1'
      },
      aiService: {
        status: aiHealth.online ? 'connected' : 'fallback-mode',
        details: aiHealth
      }
    }
  });
});

module.exports = router;
