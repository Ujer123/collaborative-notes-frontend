import axios from "axios";

let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = "http://localhost:5000/api";  
} else {
  baseURL = "https://workverse-backend.onrender.com/api"; 
}


const api = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;