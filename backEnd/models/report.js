import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
    },

    contractName: {
      type: String,
      required: [true, "Contract name is required"],
      trim: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    highRiskClauses: {
      type: Number,
      default: 0,
    },

    mediumRiskClauses: {
      type: Number,
      default: 0,
    },

    lowRiskClauses: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;