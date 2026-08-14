import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getReports,
  getReportById,
  createReport,
  analyzeContract,
} from "../controllers/reportController.js";

const router = express.Router();

// Get my reports
router.get(
  "/",
  authMiddleware,
  getReports
);

// Analyze contract using AI service
router.post(
  "/analyze/:contractId",
  authMiddleware,
  analyzeContract
);

// Get single report
router.get(
  "/:id",
  authMiddleware,
  getReportById
);

// Create manual report
router.post(
  "/",
  authMiddleware,
  createReport
);

export default router;