const Contract = require("../models/contract");

// Upload PDF
exports.uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    const contract = await Contract.create({
      title: req.body.title,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Contracts

exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().sort({
      createdAt: -1,
    });

    res.json(contracts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Contract

exports.deleteContract = async (req, res) => {
  try {
    await Contract.findByIdAndDelete(req.params.id);

    res.json({
      message: "Contract deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Edit Contract Title

exports.updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
      },
      { new: true }
    );

    res.json(contract);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};