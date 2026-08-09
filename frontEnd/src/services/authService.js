import axios from "axios";
import { API_CONFIG } from "../config/api";

const API = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth`,
    headers: {
    "Content-Type": "application/json",
    },
    // withCredentials: true,
});

export const loginUser = (data) => API.post("/login", data);

export const registerUser = (data) => API.post("/register", data);

export default API;