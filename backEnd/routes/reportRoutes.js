// Start coding here
import express from "express";

import {
  getReports,
  getReportById,
  createReport,
} from "../controllers/reportController.js";

const router = express.Router();

// Get all reports
router.get("/", getReports);

// Get single report
router.get("/:id", getReportById);

// Create report
router.post("/", createReport);

export default router;