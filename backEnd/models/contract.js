

const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      default: "application/pdf",
    },

    uploadedBy: {
      type: String,
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contract", contractSchema);