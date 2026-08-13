import { useEffect, useState } from "react";

import {
  getContracts,
  getContractFile,
  deleteContract,
  updateContract,
} from "../services/contractService";

export default function MyContracts() {
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

  if (loading) {
    return <p>Loading contracts...</p>;
  }

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
          <div
            key={contract._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h4>{contract.title}</h4>

            <p>{contract.fileName}</p>

            <p>
              Type: {contract.fileType}
            </p>

            <button onClick={() => handleView(contract._id)}>
                 View
              </button>

            <button
              onClick={() =>
                handleEdit(contract._id)
              }
            >
              Edit
            </button>

            {" "}

            <button
              onClick={() =>
                handleDelete(contract._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}