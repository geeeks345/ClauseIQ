import { useState } from "react";
import { uploadContract } from "../services/contractService";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select PDF");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("file", file);

    await uploadContract(formData);

    alert("Uploaded Successfully");

    setTitle("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Upload Contract</h2>

      <input
        placeholder="Contract Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />

      <button>Upload</button>

    </form>
  );
}