import axios from "axios";
import { API_CONFIG } from "../config/api";

const API = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/contracts`,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadContract = (data) => {
  return API.post("/upload", data);
};

export const getContracts = () => {
  return API.get("/");
};

export const getContract = (id) => {
  return API.get(`/${id}`);
};

export const getContractFile = (id) => {
  return API.get(`/${id}/file`, {
    responseType: "blob",
  });
};

export const deleteContract = (id) => {
  return API.delete(`/${id}`);
};

export const updateContract = (id, title) => {
  return API.put(`/${id}`, {
    title,
  });
};

export default API;