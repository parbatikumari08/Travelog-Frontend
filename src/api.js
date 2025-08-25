// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ must be "baseURL"
  withCredentials: true,                      // allow cookies for sessions
});

export default api;
