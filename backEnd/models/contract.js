import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contract title is required"],
      trim: true,
      maxlength: 150,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;