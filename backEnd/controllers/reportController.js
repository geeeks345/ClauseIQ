const Contract = require('../models/Contract');
const Analysis = require('../models/Analysis');
const History = require('../models/History');
const PDFReportGenerator = require('../services/pdfReportGenerator');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Generate and download PDF report for a contract
// @route   GET /api/v1/reports/pdf/:contractId
// @access  Private
const generatePdfReport = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.contractId,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  const analysis = await Analysis.findOne({
    contractId: contract._id,
    userId: req.user._id
  }).sort({ createdAt: -1 });

  if (!analysis) {
    return ApiResponse.error(res, 'Contract has not been analyzed yet. Please run AI analysis first.', 400);
  }

  await History.create({
    userId: req.user._id,
    action: 'REPORT_DOWNLOADED',
    contractId: contract._id,
    contractTitle: contract.title,
    details: { format: 'PDF', riskScore: analysis.overallRiskScore }
  });

  PDFReportGenerator.generateContractReport(contract, analysis, req.user, res);
});

// @desc    Export Analysis in JSON format
// @route   GET /api/v1/reports/json/:contractId
// @access  Private
const exportJsonReport = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.contractId,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  const analysis = await Analysis.findOne({
    contractId: contract._id,
    userId: req.user._id
  }).sort({ createdAt: -1 });

  if (!analysis) {
    return ApiResponse.error(res, 'Contract has not been analyzed yet', 400);
  }

  const reportPayload = {
    platform: 'ClauseIQ v1.0.0',
    generatedAt: new Date().toISOString(),
    user: {
      name: req.user.name,
      email: req.user.email,
      company: req.user.company
    },
    contract: {
      id: contract._id,
      title: contract.title,
      fileName: contract.originalName,
      fileType: contract.fileType,
      fileSize: contract.fileSize,
      pageCount: contract.pageCount,
      wordCount: contract.wordCount,
      status: contract.status
    },
    riskAssessment: {
      overallScore: analysis.overallRiskScore,
      riskLevel: analysis.riskLevel,
      executiveSummary: analysis.executiveSummary,
      criticalRedFlags: analysis.criticalRedFlags,
      keyStrengths: analysis.keyStrengths,
      riskDistribution: analysis.riskDistribution,
      clausesCount: analysis.clauses.length,
      clauses: analysis.clauses
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="ClauseIQ_${contract.title.replace(/[^a-zA-Z0-9]/g, '_')}.json"`);
  return res.json(reportPayload);
});

// @desc    Get all available reports for user's analyzed contracts
// @route   GET /api/v1/reports
// @access  Private
const getReportsList = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({
    userId: req.user._id,
    status: 'analyzed'
  })
    .sort({ updatedAt: -1 })
    .populate('latestAnalysisId');

  const reports = contracts.map((c) => ({
    contractId: c._id,
    contractTitle: c.title,
    fileName: c.originalName,
    fileType: c.fileType,
    analyzedAt: c.updatedAt,
    riskSummary: c.riskSummary,
    analysisId: c.latestAnalysisId?._id
  }));

  return ApiResponse.success(res, { reports }, 'Reports list retrieved');
});

module.exports = {
  generatePdfReport,
  exportJsonReport,
  getReportsList
};
