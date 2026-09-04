const mongoose = require('mongoose');

const ClauseItemSchema = new mongoose.Schema({
  clauseId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Termination',
      'Non-Compete',
      'Payment Terms',
      'Confidentiality',
      'Arbitration & Dispute',
      'Auto-Renewal',
      'Liability & Indemnity',
      'Intellectual Property',
      'Governing Law',
      'Force Majeure',
      'General / Other'
    ],
    default: 'General / Other'
  },
  originalText: {
    type: String,
    required: true
  },
  plainEnglish: {
    type: String,
    required: true
  },
  risk: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  riskRationale: {
    type: String,
    default: ''
  },
  realWorldExample: {
    type: String,
    default: ''
  },
  recommendation: {
    type: String,
    default: ''
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.95
  },
  pageNumber: {
    type: Number,
    default: 1
  },
  legalReferences: [
    {
      statute: String,
      section: String,
      jurisdiction: String,
      summary: String,
      relevanceScore: Number
    }
  ]
});

const AnalysisSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    version: {
      type: Number,
      default: 1
    },
    overallRiskScore: {
      type: Number,
      required: true, // 0 - 100
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },
    executiveSummary: {
      type: String,
      required: true
    },
    keyStrengths: [String],
    criticalRedFlags: [String],
    clauses: [ClauseItemSchema],
    riskDistribution: {
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 }
    },
    categoryBreakdown: {
      type: Map,
      of: Number,
      default: {}
    },
    processingDurationMs: {
      type: Number,
      default: 0
    },
    aiEngineVersion: {
      type: String,
      default: 'ClauseIQ-Engine-v1.0'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
