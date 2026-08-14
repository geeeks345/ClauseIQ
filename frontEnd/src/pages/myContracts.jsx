import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {analyzeContract,} from "../services/reportService";

import {
  getContracts,
  deleteContract,
  updateContract,
  getContractFile,
} from "../services/contractService";

export default function MyContracts() {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getContracts();

      console.log("Contracts response:", res.data);

      setContracts(res.data.contracts || []);
    } catch (err) {
      console.error("Failed to load contracts:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load contracts"
      );

      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  // ==============================
  // Delete Contract
  // ==============================
  const handleDelete = async (id) => {
    try {
      await deleteContract(id);
      await loadContracts();
    } catch (err) {
      console.error("Delete failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete contract"
      );
    }
  };

  // ==============================
  // View Contract
  // ==============================
  const handleView = async (id) => {
    try {
      const response = await getContractFile(id);

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Failed to open contract:", err);

      setError(
        err.response?.data?.message ||
          "Failed to open contract"
      );
    }
  };

  // ==============================
  // Analyze Contract
  // ==============================
 const handleAnalyze = async (contract) => {
  try {
    const response = await analyzeContract(
      contract._id
    );

    const reportId =
      response.data.report._id;

    navigate(`/reports/${reportId}`);

  } catch (err) {
    console.error(
      "Analyze Contract Error:",
      err
    );

    alert(
      err.response?.data?.message ||
        "Failed to analyze contract"
    );
  }
};

  // ==============================
  // Edit Contract
  // ==============================
  const handleEdit = async (id) => {
    const title = prompt("New Title");

    if (!title?.trim()) {
      return;
    }

    try {
      await updateContract(id, title.trim());
      await loadContracts();
    } catch (err) {
      console.error("Update failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update contract"
      );
    }
  };

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return <p>Loading contracts...</p>;
  }

  // ==============================
  // Page
  // ==============================
  return (
    <div>
      <h2>My Contracts</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {contracts.length === 0 ? (
        <p>No contracts uploaded yet.</p>
      ) : (
        contracts.map((contract) => (
          <div key={contract._id}>
            <h4>{contract.title}</h4>

            <p>{contract.fileName}</p>

            <button
              onClick={() => handleView(contract._id)}
            >
              View
            </button>

            <button
              onClick={() => handleAnalyze(contract)}
            >
              Analyze
            </button>

            <button
              onClick={() => handleEdit(contract._id)}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(contract._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}