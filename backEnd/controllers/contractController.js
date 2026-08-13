import Contract from "../models/contract.js";
import fs from "fs";
import path from "path";

// ===============================
// Upload Contract
// ===============================
export const uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    if (!req.body.title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Contract title is required",
      });
    }

    const contract = await Contract.create({
      title: req.body.title.trim(),
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Contract uploaded successfully",
      contract,
    });
  } catch (error) {
    console.error("Upload Contract Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get My Contracts
// ===============================
export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({
      uploadedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email role");

    return res.status(200).json({
      success: true,
      count: contracts.length,
      contracts,
    });
  } catch (error) {
    console.error("Get Contracts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Single Contract
// ===============================
export const getContract = async (req, res) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    }).populate("uploadedBy", "name email role");

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.status(200).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error("Get Contract Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Contract
// ===============================
export const updateContract = async (req, res) => {
  try {
    if (!req.body.title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Contract title is required",
      });
    }

    const contract = await Contract.findOneAndUpdate(
      {
        _id: req.params.id,
        uploadedBy: req.user._id,
      },
      {
        title: req.body.title.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contract updated successfully",
      contract,
    });
  } catch (error) {
    console.error("Update Contract Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Contract
// ===============================
export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contract deleted successfully",
    });
  } catch (error) {
    console.error("Delete Contract Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// View Contract PDF
// ===============================
export const getContractFile = async (req, res) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    const filePath = path.resolve(contract.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Contract file not found",
      });
    }

    res.setHeader("Content-Type", contract.fileType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${contract.fileName}"`
    );

    return res.sendFile(filePath);
  } catch (error) {
    console.error("View Contract File Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};