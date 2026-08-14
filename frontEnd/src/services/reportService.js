import axios from "axios";
import { API_CONFIG } from "../config/api";

const API = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/reports`,
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

// Get all reports
export const getReports = () => {
  return API.get("/");
};

// Get single report
export const getReportById = (id) => {
  return API.get(`/${id}`);
};

// Analyze contract using AI service
export const analyzeContract = (contractId) => {
  return API.post(`/analyze/${contractId}`);
};

// Manual report creation
export const createReport = (data) => {
  return API.post("/", data);
};

export default API;