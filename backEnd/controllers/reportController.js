import Report from "../models/report.js";
import Contract from "../models/contract.js";

import fs from "fs/promises";

// ==============================
// Get My Reports
// ==============================
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({
      createdBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("contractId", "title fileName")
      .populate("createdBy", "name email role");

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Analyze Contract Using AI
// ==============================
export const analyzeContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    // ==========================================
    // Validate Contract ID
    // ==========================================

    if (!contractId) {
      return res.status(400).json({
        success: false,
        message: "Contract ID is required",
      });
    }

    // ==========================================
    // Find Contract
    // ==========================================

    const contract = await Contract.findOne({
      _id: contractId,
      uploadedBy: req.user._id,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    // ==========================================
    // Check PDF File
    // ==========================================

    try {
      await fs.access(contract.filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: "Contract PDF file not found",
      });
    }

    // ==========================================
    // Read PDF
    // ==========================================

    const pdfBuffer = await fs.readFile(
      contract.filePath
    );

    // ==========================================
    // Create Multipart Form
    // ==========================================

    const formData = new FormData();

    const pdfBlob = new Blob(
      [pdfBuffer],
      {
        type:
          contract.fileType ||
          "application/pdf",
      }
    );

    formData.append(
      "file",
      pdfBlob,
      contract.fileName
    );

    // ==========================================
    // Send PDF To Python AI Service
    // ==========================================

    const aiResponse = await fetch(
      "http://127.0.0.1:8000/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const aiData = await aiResponse.json();

    // ==========================================
    // Handle AI Service Error
    // ==========================================

    if (!aiResponse.ok) {
      console.error(
        "AI Service Error:",
        aiData
      );

      return res.status(502).json({
        success: false,
        message:
          aiData.detail ||
          "AI service failed to analyze the contract",
      });
    }

    // ==========================================
    // Extract Clauses
    // ==========================================

    const clauses = aiData.clauses || [];

    if (clauses.length === 0) {
      return res.status(422).json({
        success: false,
        message:
          "AI service did not return any clauses",
      });
    }

    // ==========================================
    // Calculate Risk Counts
    // ==========================================

    const highRiskClauses =
      clauses.filter(
        (clause) =>
          clause.risk_level === "high"
      ).length;

    const mediumRiskClauses =
      clauses.filter(
        (clause) =>
          clause.risk_level === "medium"
      ).length;

    const lowRiskClauses =
      clauses.filter(
        (clause) =>
          clause.risk_level === "low"
      ).length;

    // ==========================================
    // Calculate Overall Risk Score
    // ==========================================

    const scores = clauses.map(
      (clause) =>
        Number(clause.risk_score || 0)
    );

    const averageScore =
      scores.length > 0
        ? scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / scores.length
        : 0;

    const maxScore =
      scores.length > 0
        ? Math.max(...scores)
        : 0;

    const highWeight =
      highRiskClauses * 25;

    const mediumWeight =
      mediumRiskClauses * 10;

    const riskScore = Math.min(
      100,
      Math.round(
        averageScore +
          highWeight +
          mediumWeight +
          maxScore * 0.25
      )
    );

    // ==========================================
    // Convert Python snake_case
    // To MongoDB camelCase
    // ==========================================

    const formattedClauses =
      clauses.map(
        (clause) => ({
          clauseText:
            clause.clause_text || "",

          riskScore:
            Number(
              clause.risk_score || 0
            ),

          riskLevel:
            clause.risk_level ||
            "low",

          reason:
            clause.reason || "",

          category:
            clause.category ||
            "general",

          plainEnglish:
            clause.plain_english ||
            "",

          whyItMatters:
            clause.why_it_matters ||
            "",

          recommendation:
            clause.recommendation ||
            "",
        })
      );

    // ==========================================
    // Create Report
    // ==========================================

    const report =
      await Report.create({
        contractId:
          contract._id,

        title:
          `${contract.title} Risk Analysis`,

        contractName:
          contract.title,

        riskScore,

        highRiskClauses,

        mediumRiskClauses,

        lowRiskClauses,

        summary:
          aiData.summary ||
          "Contract analysis completed.",

        clauses:
          formattedClauses,

        createdBy:
          req.user._id,
      });

    // ==========================================
    // Return Report
    // ==========================================

    return res.status(201).json({
      success: true,
      message:
        "Contract analyzed successfully",
      report,
    });

  } catch (error) {
    console.error(
      "Analyze Contract Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Report By ID
// ==============================
export const getReportById = async (
  req,
  res
) => {
  try {
    const report =
      await Report.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
      })
        .populate(
          "contractId",
          "title fileName fileType"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {
    console.error(
      "Get Report Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Manual Report
// ==============================
export const createReport = async (
  req,
  res
) => {
  try {
    const {
      contractId,
      title,
      riskScore,
      highRiskClauses,
      mediumRiskClauses,
      lowRiskClauses,
      summary,
    } = req.body;

    // ==========================================
    // Validate Contract ID
    // ==========================================

    if (!contractId) {
      return res.status(400).json({
        success: false,
        message:
          "Contract ID is required",
      });
    }

    // ==========================================
    // Validate Title
    // ==========================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Report title is required",
      });
    }

    // ==========================================
    // Validate Risk Score
    // ==========================================

    if (
      riskScore === undefined ||
      riskScore === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Risk score is required",
      });
    }

    // ==========================================
    // Verify Contract Ownership
    // ==========================================

    const contract =
      await Contract.findOne({
        _id: contractId,
        uploadedBy: req.user._id,
      });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message:
          "Contract not found",
      });
    }

    // ==========================================
    // Create Manual Report
    // ==========================================

    const report =
      await Report.create({
        contractId:
          contract._id,

        title:
          title.trim(),

        contractName:
          contract.title,

        riskScore,

        highRiskClauses:
          highRiskClauses || 0,

        mediumRiskClauses:
          mediumRiskClauses || 0,

        lowRiskClauses:
          lowRiskClauses || 0,

        summary:
          summary || "",

        createdBy:
          req.user._id,
      });

    // ==========================================
    // Return Report
    // ==========================================

    return res.status(201).json({
      success: true,
      message:
        "Report created successfully",
      report,
    });

  } catch (error) {
    console.error(
      "Create Report Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};