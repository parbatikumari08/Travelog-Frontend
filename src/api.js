// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://travelog-backend-2.onrender.com", // backend server
  withCredentials: true,            // allow cookies for sessions
});

export default api;
