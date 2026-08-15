import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadContract,
  getContracts,
  getContract,
  getContractFile,
  updateContract,
  deleteContract,
} from "../controllers/contractController.js";

const router = express.Router();

// ===============================
// Upload Directory
// ===============================

const uploadDirectory = path.resolve("uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ===============================
// Multer Storage
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

// ===============================
// PDF Filter
// ===============================

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ===============================
// Routes
// ===============================

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadContract
);

router.get(
  "/",
  authMiddleware,
  getContracts
);

router.get(
  "/:id",
  authMiddleware,
  getContract
);

router.put(
  "/:id",
  authMiddleware,
  updateContract
);

router.delete(
  "/:id",
  authMiddleware,
  deleteContract
);

router.get(
  "/:id/file",
  authMiddleware,
  getContractFile
);

// ===============================
// Export
// ===============================

export default router;