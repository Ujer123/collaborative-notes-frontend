"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // Correct import for Axios instance

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null); // For error handling
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null); // Clear any previous errors

    try {
      const { data } = await api.post("/auth/login", { email, password }); // Use the pre-configured Axios instance
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        setLoginError(error.response.data.message || "Login failed."); // Show server error message
      } else if (error.request) {
        setLoginError("No response from server. Please try again.");
      } else {
        setLoginError("An error occurred during login.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>

        {loginError && <p className="text-red-500 mb-4">{loginError}</p>} {/* Display error message */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Log In
        </button>
      </form>
    </div>
  );
}
