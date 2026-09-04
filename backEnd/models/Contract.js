const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Contract title is required'],
      trim: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx', 'txt'],
      required: true
    },
    fileSize: {
      type: Number,
      required: true // in bytes
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'analyzed', 'error'],
      default: 'uploaded',
      index: true
    },
    extractedText: {
      type: String,
      default: ''
    },
    pageCount: {
      type: Number,
      default: 1
    },
    wordCount: {
      type: Number,
      default: 0
    },
    contractType: {
      type: String,
      enum: ['Employment', 'NDA', 'Vendor / Service', 'Lease / Real Estate', 'IP License', 'Other'],
      default: 'Other'
    },
    latestAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null
    },
    riskSummary: {
      overallScore: { type: Number, default: 0 }, // 0 to 100
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical', 'Unanalyzed'], default: 'Unanalyzed' },
      highRiskCount: { type: Number, default: 0 },
      mediumRiskCount: { type: Number, default: 0 },
      lowRiskCount: { type: Number, default: 0 },
      totalClauses: { type: Number, default: 0 }
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Compound index for quick searching and sorting
ContractSchema.index({ userId: 1, createdAt: -1 });
ContractSchema.index({ title: 'text', originalName: 'text' });

module.exports = mongoose.model('Contract', ContractSchema);
