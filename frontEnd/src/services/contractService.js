import axios from "axios";

const API = "http://localhost:5000/api/contracts";

export const uploadContract = (data) => {
  return axios.post(`${API}/upload`, data);
};

export const getContracts = () => {
  return axios.get(API);
};

export const deleteContract = (id) => {
  return axios.delete(`${API}/${id}`);
};

export const updateContract = (id, title) => {
  return axios.put(`${API}/${id}`, {
    title,
  });
};