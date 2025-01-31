import axios from "axios";

let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = "http://localhost:5000/api";  // Development URL
} else {
  baseURL = "https://workverse-backend.onrender.com/api"; // Production URL
}


const api = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // VERY IMPORTANT if using cookies/sessions!
});

export default api;