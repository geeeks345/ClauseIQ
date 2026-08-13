import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadContract } from "../services/contractService";

const Upload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("UPLOAD BUTTON CLICKED");

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Contract title is required");
      return;
    }

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("file", file);

    try {
      setIsUploading(true);

      console.log("Sending contract to backend...");

      const response = await uploadContract(formData);

      console.log("Upload response:", response.data);

      if (response.data.success) {
        setMessage("Contract uploaded successfully");

        setTitle("");
        setFile(null);

        const fileInput = document.getElementById("contract-file");

        if (fileInput) {
          fileInput.value = "";
        }

        setTimeout(() => {
          navigate("/contracts");
        }, 1000);
      }
    } catch (err) {
      console.error("Upload error:", err);

      setError(
        err.response?.data?.message ||
          "Contract upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Contract</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="contract-title">
            Contract Title
          </label>

          <input
            id="contract-title"
            type="text"
            placeholder="Enter contract title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label htmlFor="contract-file">
            Select PDF
          </label>

          <input
            id="contract-file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError("");
            }}
          />
        </div>

        <br />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ color: "green" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Contract"}
        </button>

      </form>
    </div>
  );
};

export default Upload;