import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for your API
  timeout: 5000, // Optional: Set a timeout
  headers: {
    "Content-Type": "application/json", // Ensure proper content type
  },
});

export default api;
