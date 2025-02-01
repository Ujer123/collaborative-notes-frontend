import axios from "axios";

let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = "http://localhost:5000/api";  
} else {
  baseURL = "https://workverse-backend.onrender.com/api"; 
}


const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
