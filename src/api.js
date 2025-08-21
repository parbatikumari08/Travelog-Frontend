// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend server
  withCredentials: true,            // allow cookies for sessions
});

export default api;
