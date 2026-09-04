const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CONTRACT_UPLOADED',
        'ANALYSIS_COMPLETED',
        'REPORT_DOWNLOADED',
        'CONTRACT_COMPARED',
        'CONTRACT_RENAMED',
        'CONTRACT_DELETED',
        'CHAT_QUERY_ASKED'
      ]
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      default: null
    },
    contractTitle: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

HistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('History', HistorySchema);
