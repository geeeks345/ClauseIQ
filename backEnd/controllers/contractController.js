const fs = require('fs');
const path = require('path');
const Contract = require('../models/Contract');
const Analysis = require('../models/Analysis');
const History = require('../models/History');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AIClient = require('../services/aiClient');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload a new contract file
// @route   POST /api/v1/contracts/upload
// @access  Private
const uploadContract = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'Please upload a file (.pdf, .docx, .txt)', 400);
  }

  const { originalname, filename, path: filePath, size } = req.file;
  const ext = path.extname(originalname).toLowerCase().replace('.', '');
  const title = req.body.title || path.basename(originalname, path.extname(originalname));
  const contractType = req.body.contractType || 'Other';

  // Parse text via AI Service / Fallback
  const parseResult = await AIClient.parseDocument(filePath, ext, originalname);

  const contract = await Contract.create({
    userId: req.user._id,
    title,
    fileName: filename,
    originalName: originalname,
    filePath,
    fileType: ext,
    fileSize: size,
    status: 'uploaded',
    extractedText: parseResult.text || '',
    pageCount: parseResult.pages || 1,
    wordCount: parseResult.wordCount || 0,
    contractType
  });

  // Increment user counter
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.contractsUploaded': 1 }
  });

  // Log activity
  await History.create({
    userId: req.user._id,
    action: 'CONTRACT_UPLOADED',
    contractId: contract._id,
    contractTitle: contract.title,
    details: { fileSize: size, fileType: ext, pages: contract.pageCount }
  });

  // Create notification
  await Notification.create({
    userId: req.user._id,
    title: 'Contract Ingested',
    message: `"${contract.title}" uploaded successfully and ready for AI risk analysis.`,
    type: 'success',
    link: `/analysis/${contract._id}`
  });

  return ApiResponse.success(res, { contract }, 'Contract uploaded and processed successfully', 201);
});

// @desc    Get all contracts for user with filter, search & pagination
// @route   GET /api/v1/contracts
// @access  Private
const getAllContracts = asyncHandler(async (req, res) => {
  const { search, risk, type, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const query = { userId: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { originalName: { $regex: search, $options: 'i' } }
    ];
  }

  if (risk && risk !== 'All') {
    query['riskSummary.riskLevel'] = risk;
  }

  if (type && type !== 'All') {
    query.contractType = type;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [contracts, total] = await Promise.all([
    Contract.find(query).sort(sort).skip(skip).limit(Number(limit)).populate('latestAnalysisId'),
    Contract.countDocuments(query)
  ]);

  return ApiResponse.paginated(res, contracts, { page, limit, total }, 'Contracts retrieved successfully');
});

// @desc    Get single contract by ID
// @route   GET /api/v1/contracts/:id
// @access  Private
const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id
  }).populate('latestAnalysisId');

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  return ApiResponse.success(res, { contract }, 'Contract details retrieved');
});

// @desc    Update contract metadata
// @route   PUT /api/v1/contracts/:id
// @access  Private
const updateContract = asyncHandler(async (req, res) => {
  const { title, contractType, tags } = req.body;

  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  if (title) contract.title = title;
  if (contractType) contract.contractType = contractType;
  if (tags) contract.tags = tags;

  await contract.save();

  await History.create({
    userId: req.user._id,
    action: 'CONTRACT_RENAMED',
    contractId: contract._id,
    contractTitle: contract.title,
    details: { newTitle: title, contractType }
  });

  return ApiResponse.success(res, { contract }, 'Contract updated successfully');
});

// @desc    Delete contract and associated analysis
// @route   DELETE /api/v1/contracts/:id
// @access  Private
const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  // Delete physical file if exists
  if (fs.existsSync(contract.filePath)) {
    try {
      fs.unlinkSync(contract.filePath);
    } catch (e) {
      console.warn(`[Delete Contract] Could not delete file: ${contract.filePath}`);
    }
  }

  // Delete related analyses
  await Analysis.deleteMany({ contractId: contract._id });

  await contract.deleteOne();

  await History.create({
    userId: req.user._id,
    action: 'CONTRACT_DELETED',
    contractTitle: contract.title,
    details: { deletedAt: new Date() }
  });

  return ApiResponse.success(res, null, 'Contract deleted successfully');
});

// @desc    Download raw contract document
// @route   GET /api/v1/contracts/:id/download
// @access  Private
const downloadRawFile = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!contract) {
    return ApiResponse.error(res, 'Contract not found', 404);
  }

  if (!fs.existsSync(contract.filePath)) {
    return ApiResponse.error(res, 'File not found on server', 404);
  }

  res.download(contract.filePath, contract.originalName);
});

module.exports = {
  uploadContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  downloadRawFile
};
