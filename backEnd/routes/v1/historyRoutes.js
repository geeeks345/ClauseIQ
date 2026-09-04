const express = require('express');
const router = express.Router();
const { getHistory, clearHistory } = require('../../controllers/historyController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.get('/', getHistory);
router.delete('/', clearHistory);

module.exports = router;
