import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getReportById } from "../services/reportService";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getReportById(id);

        setReport(response.data.report);
      } catch (err) {
        console.error("Get Report Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load report"
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <h2>Unable to load report</h2>

            <p>{error}</p>

            <button
              style={styles.primaryButton}
              onClick={() =>
                navigate("/contracts")
              }
            >
              Back to Contracts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Report Not Found
  // ==========================================

  if (!report) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h2>Report not found.</h2>

          <button
            style={styles.primaryButton}
            onClick={() =>
              navigate("/contracts")
            }
          >
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // Risk Helpers
  // ==========================================

  const getRiskClass = (level) => {
    switch (level) {
      case "high":
        return styles.highRisk;

      case "medium":
        return styles.mediumRisk;

      case "low":
        return styles.lowRisk;

      default:
        return styles.lowRisk;
    }
  };

  const getRiskLabel = (level) => {
    if (!level) {
      return "LOW";
    }

    return level.toUpperCase();
  };

  const getScoreClass = (score) => {
    if (score >= 70) {
      return styles.highScore;
    }

    if (score >= 40) {
      return styles.mediumScore;
    }

    return styles.lowScore;
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ==================================
            Header
        ================================== */}

        <div style={styles.header}>
          <div>
            <button
              style={styles.backButton}
              onClick={() =>
                navigate("/contracts")
              }
            >
              ← Back to Contracts
            </button>

            <p style={styles.eyebrow}>
              CLAUSEIQ RISK REPORT
            </p>

            <h1 style={styles.title}>
              {report.title}
            </h1>

            <p style={styles.contractName}>
              {report.contractName}
            </p>
          </div>

          <div style={styles.reportId}>
            Report ID
            <br />
            <strong>{report._id}</strong>
          </div>
        </div>

        {/* ==================================
            Risk Overview
        ================================== */}

        <section style={styles.overviewCard}>
          <div style={styles.scoreSection}>

            <p style={styles.sectionLabel}>
              OVERALL RISK SCORE
            </p>

            <div
              style={{
                ...styles.bigScore,
                ...getScoreClass(
                  report.riskScore
                ),
              }}
            >
              {report.riskScore}
            </div>

            <p style={styles.scoreOutOf}>
              out of 100
            </p>

          </div>

          <div style={styles.riskStats}>

            <div
              style={{
                ...styles.riskStat,
                ...styles.highRisk,
              }}
            >
              <span>HIGH</span>

              <strong>
                {report.highRiskClauses}
              </strong>

              <small>
                clauses
              </small>
            </div>

            <div
              style={{
                ...styles.riskStat,
                ...styles.mediumRisk,
              }}
            >
              <span>MEDIUM</span>

              <strong>
                {report.mediumRiskClauses}
              </strong>

              <small>
                clauses
              </small>
            </div>

            <div
              style={{
                ...styles.riskStat,
                ...styles.lowRisk,
              }}
            >
              <span>LOW</span>

              <strong>
                {report.lowRiskClauses}
              </strong>

              <small>
                clauses
              </small>
            </div>

          </div>
        </section>

        {/* ==================================
            AI Summary
        ================================== */}

        <section style={styles.card}>
          <p style={styles.sectionLabel}>
            AI SUMMARY
          </p>

          <h2 style={styles.sectionTitle}>
            Contract Overview
          </h2>

          <p style={styles.summary}>
            {report.summary ||
              "No summary available."}
          </p>
        </section>

        {/* ==================================
            Clause Analysis
        ================================== */}

        <section>
          <div style={styles.clauseHeader}>
            <div>
              <p style={styles.sectionLabel}>
                CLAUSE ANALYSIS
              </p>

              <h2 style={styles.sectionTitle}>
                Contract Findings
              </h2>
            </div>

            <div style={styles.clauseCount}>
              {report.clauses?.length || 0} clauses
            </div>
          </div>

          {report.clauses?.length > 0 ? (
            <div style={styles.clauseList}>

              {report.clauses.map(
                (clause, index) => (
                  <article
                    key={
                      clause._id ||
                      index
                    }
                    style={styles.clauseCard}
                  >

                    {/* Clause Header */}

                    <div
                      style={
                        styles.clauseTop
                      }
                    >
                      <div>

                        <p
                          style={
                            styles.clauseNumber
                          }
                        >
                          CLAUSE {index + 1}
                        </p>

                        <h3
                          style={
                            styles.clauseTitle
                          }
                        >
                          {clause.clauseText}
                        </h3>

                      </div>

                      <div
                        style={
                          styles.riskColumn
                        }
                      >
                        <span
                          style={{
                            ...styles.riskBadge,
                            ...getRiskClass(
                              clause.riskLevel
                            ),
                          }}
                        >
                          {getRiskLabel(
                            clause.riskLevel
                          )}
                        </span>

                        <strong
                          style={
                            styles.clauseScore
                          }
                        >
                          {clause.riskScore}
                        </strong>
                      </div>
                    </div>

                    {/* Category */}

                    <div
                      style={
                        styles.categoryRow
                      }
                    >
                      <span>
                        Category
                      </span>

                      <strong>
                        {clause.category ||
                          "general"}
                      </strong>
                    </div>

                    {/* Reason */}

                    <div
                      style={
                        styles.contentBlock
                      }
                    >
                      <h4>
                        Risk Reason
                      </h4>

                      <p>
                        {clause.reason ||
                          "No specific risk reason provided."}
                      </p>
                    </div>

                    {/* Plain English */}

                    <div
                      style={
                        styles.contentBlock
                      }
                    >
                      <h4>
                        What This Means
                      </h4>

                      <p>
                        {clause.plainEnglish ||
                          "No explanation available."}
                      </p>
                    </div>

                    {/* Why It Matters */}

                    <div
                      style={
                        styles.contentBlock
                      }
                    >
                      <h4>
                        Why It Matters
                      </h4>

                      <p>
                        {clause.whyItMatters ||
                          "No additional impact information available."}
                      </p>
                    </div>

                    {/* Recommendation */}

                    <div
                      style={
                        styles.recommendation
                      }
                    >
                      <h4>
                        Recommendation
                      </h4>

                      <p>
                        {clause.recommendation ||
                          "Review this clause carefully before approval."}
                      </p>
                    </div>

                  </article>
                )
              )}

            </div>
          ) : (
            <div style={styles.emptyBox}>
              No clause analysis is available
              for this report.
            </div>
          )}
        </section>

        {/* ==================================
            Footer
        ================================== */}

        <div style={styles.footer}>
          <button
            style={styles.primaryButton}
            onClick={() =>
              navigate("/contracts")
            }
          >
            Back to My Contracts
          </button>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// Styles
// ==========================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    marginBottom: "30px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
  },

  eyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    margin: "0 0 8px",
    opacity: 0.6,
  },

  title: {
    fontSize: "32px",
    margin: "0 0 8px",
  },

  contractName: {
    fontSize: "16px",
    margin: 0,
    opacity: 0.65,
  },

  reportId: {
    fontSize: "11px",
    opacity: 0.55,
    textAlign: "right",
    wordBreak: "break-all",
    maxWidth: "250px",
  },

  overviewCard: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "30px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  scoreSection: {
    textAlign: "center",
    borderRight: "1px solid #e5e7eb",
    paddingRight: "30px",
  },

  sectionLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    margin: "0 0 10px",
    opacity: 0.55,
  },

  bigScore: {
    fontSize: "64px",
    lineHeight: 1,
    fontWeight: "800",
    marginTop: "12px",
  },

  scoreOutOf: {
    margin: "8px 0 0",
    fontSize: "13px",
    opacity: 0.55,
  },

  riskStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    alignItems: "center",
  },

  riskStat: {
    borderRadius: "12px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  highRisk: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  mediumRisk: {
    background: "#fef3c7",
    color: "#92400e",
  },

  lowRisk: {
    background: "#dcfce7",
    color: "#166534",
  },

  highScore: {
    color: "#b91c1c",
  },

  mediumScore: {
    color: "#b45309",
  },

  lowScore: {
    color: "#15803d",
  },

  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    fontSize: "22px",
    margin: "0 0 12px",
  },

  summary: {
    fontSize: "15px",
    lineHeight: 1.7,
    margin: 0,
    color: "#4b5563",
  },

  clauseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "16px",
  },

  clauseCount: {
    fontSize: "13px",
    opacity: 0.6,
  },

  clauseList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  clauseCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  clauseTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "25px",
    alignItems: "flex-start",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "20px",
  },

  clauseNumber: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    opacity: 0.5,
    margin: "0 0 8px",
  },

  clauseTitle: {
    fontSize: "18px",
    lineHeight: 1.5,
    margin: 0,
  },

  riskColumn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },

  riskBadge: {
    fontSize: "11px",
    fontWeight: "800",
    padding: "6px 10px",
    borderRadius: "999px",
  },

  clauseScore: {
    fontSize: "18px",
  },

  categoryRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    margin: "18px 0 22px",
    fontSize: "12px",
    color: "#6b7280",
  },

  contentBlock: {
    marginBottom: "20px",
  },

  contentBlockHeading: {
    margin: "0 0 7px",
    fontSize: "15px",
    fontWeight: "700",
  },

  contentBlockText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#4b5563",
  },

  recommendation: {
    background: "#eff6ff",
    borderLeft: "4px solid #2563eb",
    padding: "16px 18px",
    borderRadius: "8px",
  },

  recommendationHeading: {
    margin: "0 0 7px",
    fontSize: "15px",
    fontWeight: "700",
  },

  recommendationText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.7,
  },

  emptyBox: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    opacity: 0.6,
  },

  errorBox: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    cursor: "pointer",
    background: "#111827",
    color: "#ffffff",
    fontWeight: "600",
  },

  footer: {
    marginTop: "30px",
    paddingBottom: "40px",
  },
};

export default Report;