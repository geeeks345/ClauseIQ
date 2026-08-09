import { useEffect, useState } from "react";

import {
  getContracts,
  deleteContract,
  updateContract,
} from "../services/contractService";

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);

  const loadContracts = async () => {
    const res = await getContracts();
    setContracts(res.data);
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleDelete = async (id) => {
    await deleteContract(id);
    loadContracts();
  };

  const handleEdit = async (id) => {
    const title = prompt("New Title");

    if (!title) return;

    await updateContract(id, title);

    loadContracts();
  };

  return (
    <div>

      <h2>My Contracts</h2>

      {contracts.map((contract) => (
        <div key={contract._id}>

          <h4>{contract.title}</h4>

          <p>{contract.fileName}</p>

          <button onClick={() => handleEdit(contract._id)}>
            Edit
          </button>

          <button onClick={() => handleDelete(contract._id)}>
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}