const express = require('express');
const router = express.Router();
const {
  analyzeContract,
  getAnalysis,
  chatAssistant,
  compareContracts
} = require('../../controllers/aiController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.post('/analyze/:contractId', analyzeContract);
router.get('/analysis/:contractId', getAnalysis);
router.post('/chat/:contractId', chatAssistant);
router.post('/compare', compareContracts);

module.exports = router;
