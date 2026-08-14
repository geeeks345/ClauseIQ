import mongoose from "mongoose";

const clauseSchema = new mongoose.Schema(
  {
    clauseText: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "general",
    },

    plainEnglish: {
      type: String,
      default: "",
    },

    whyItMatters: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const reportSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },

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
      trim: true,
    },

    clauses: {
      type: [clauseSchema],
      default: [],
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