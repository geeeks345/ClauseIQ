const express = require('express');
const router = express.Router();
const { generatePdfReport, exportJsonReport, getReportsList } = require('../../controllers/reportController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.get('/', getReportsList);
router.get('/pdf/:contractId', generatePdfReport);
router.get('/json/:contractId', exportJsonReport);

module.exports = router;
