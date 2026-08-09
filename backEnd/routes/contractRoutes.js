const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
  uploadContract,
  getContracts,
  deleteContract,
  updateContract,
} = require("../controllers/contractController");

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post("/upload", upload.single("file"), uploadContract);

router.get("/", getContracts);

router.delete("/:id", deleteContract);

router.put("/:id", updateContract);

module.exports = router;