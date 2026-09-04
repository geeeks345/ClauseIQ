const Contract = require('../models/Contract');
const Analysis = require('../models/Analysis');
const History = require('../models/History');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AIClient = require('../services/aiClient');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Analyze contract with AI engine (Clause detection, Risk Assessment, RAG)
// @route   POST /api/v1/ai/analyze/:contractId
// @access  Private
const analyzeContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.contractId,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  // Update status to processing
  contract.status = 'processing';
  await contract.save();

  const startTime = Date.now();

  // Call AI Service
  const aiResult = await AIClient.analyzeContract(
    contract._id.toString(),
    contract.extractedText || '',
    contract.title,
    contract.contractType
  );

  const duration = Date.now() - startTime;

  // Save Analysis document
  const analysis = await Analysis.create({
    contractId: contract._id,
    userId: req.user._id,
    overallRiskScore: aiResult.overallRiskScore,
    riskLevel: aiResult.riskLevel,
    executiveSummary: aiResult.executiveSummary,
    keyStrengths: aiResult.keyStrengths || [],
    criticalRedFlags: aiResult.criticalRedFlags || [],
    clauses: aiResult.clauses || [],
    riskDistribution: aiResult.riskDistribution || { high: 0, medium: 0, low: 0 },
    categoryBreakdown: aiResult.categoryBreakdown || {},
    processingDurationMs: duration
  });

  // Update contract with analysis results
  contract.status = 'analyzed';
  contract.latestAnalysisId = analysis._id;
  contract.riskSummary = {
    overallScore: aiResult.overallRiskScore,
    riskLevel: aiResult.riskLevel,
    highRiskCount: aiResult.riskDistribution?.high || 0,
    mediumRiskCount: aiResult.riskDistribution?.medium || 0,
    lowRiskCount: aiResult.riskDistribution?.low || 0,
    totalClauses: (aiResult.clauses || []).length
  };
  await contract.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: {
      'stats.analysesCompleted': 1,
      'stats.highRiskClausesFlagged': aiResult.riskDistribution?.high || 0
    }
  });

  // Log history
  await History.create({
    userId: req.user._id,
    action: 'ANALYSIS_COMPLETED',
    contractId: contract._id,
    contractTitle: contract.title,
    details: {
      overallRiskScore: aiResult.overallRiskScore,
      riskLevel: aiResult.riskLevel,
      highRiskCount: aiResult.riskDistribution?.high || 0,
      totalClauses: (aiResult.clauses || []).length
    }
  });

  // Trigger alert notification if high risk detected
  const isHighRisk = aiResult.overallRiskScore >= 50 || (aiResult.riskDistribution?.high || 0) > 0;
  await Notification.create({
    userId: req.user._id,
    title: isHighRisk ? `Risk Alert: High Risk Clauses in "${contract.title}"` : `Analysis Ready: "${contract.title}"`,
    message: isHighRisk
      ? `AI detected ${aiResult.riskDistribution?.high || 0} critical/high risk clauses requiring renegotiation.`
      : `Analysis completed with overall score of ${aiResult.overallRiskScore}/100.`,
    type: isHighRisk ? 'risk_alert' : 'success',
    link: `/analysis/${contract._id}`
  });

  return ApiResponse.success(
    res,
    { analysis, contract },
    'Contract analysis completed successfully'
  );
});

// @desc    Get analysis result for a contract
// @route   GET /api/v1/ai/analysis/:contractId
// @access  Private
const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    contractId: req.params.contractId,
    userId: req.user._id
  }).sort({ createdAt: -1 });

  if (!analysis) {
    return ApiResponse.error(res, 'No analysis found for this contract', 404);
  }

  return ApiResponse.success(res, { analysis }, 'Analysis retrieved successfully');
});

// @desc    Context-aware AI Chat assistant for a contract
// @route   POST /api/v1/ai/chat/:contractId
// @access  Private
const chatAssistant = asyncHandler(async (req, res) => {
  const { question, conversationHistory } = req.body;

  if (!question) {
    return ApiResponse.error(res, 'Question is required', 400);
  }

  let contractText = '';
  let contractTitle = 'Document';

  if (req.params.contractId && req.params.contractId !== 'general') {
    const contract = await Contract.findOne({
      _id: req.params.contractId,
      userId: req.user._id
    });
    if (contract) {
      contractText = contract.extractedText;
      contractTitle = contract.title;
    }
  }

  const response = await AIClient.chatWithContract(contractText, question, conversationHistory || []);

  await History.create({
    userId: req.user._id,
    action: 'CHAT_QUERY_ASKED',
    contractTitle,
    details: { question, citationsCount: response.citations?.length || 0 }
  });

  return ApiResponse.success(res, { chatResponse: response }, 'AI response generated');
});

// @desc    Compare two contracts (Milestone 11)
// @route   POST /api/v1/ai/compare
// @access  Private
const compareContracts = asyncHandler(async (req, res) => {
  const { contractAId, contractBId } = req.body;

  if (!contractAId || !contractBId) {
    return ApiResponse.error(res, 'Both contractAId and contractBId are required', 400);
  }

  const [contractA, contractB] = await Promise.all([
    Contract.findOne({ _id: contractAId, userId: req.user._id }),
    Contract.findOne({ _id: contractBId, userId: req.user._id })
  ]);

  if (!contractA || !contractB) {
    return ApiResponse.error(res, 'One or both contracts not found', 404);
  }

  const comparison = await AIClient.compareContracts(
    contractA.extractedText,
    contractB.extractedText,
    contractA.title,
    contractB.title
  );

  await History.create({
    userId: req.user._id,
    action: 'CONTRACT_COMPARED',
    details: {
      contractA: contractA.title,
      contractB: contractB.title,
      riskDelta: comparison.riskDelta
    }
  });

  return ApiResponse.success(res, { comparison }, 'Contract comparison generated');
});

module.exports = {
  analyzeContract,
  getAnalysis,
  chatAssistant,
  compareContracts
};
