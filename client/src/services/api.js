// client/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend
});

// Billing APIs
export const fetchAWS = (params = {}) => API.get("/billing", { params: { provider: "AWS", ...params } });
export const fetchGCP = (params = {}) => API.get("/billing", { params: { provider: "GCP", ...params } });
export const fetchCombined = (params = {}) => API.get("/billing", { params }); // use /billing with optional params
