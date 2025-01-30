"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // Use the correct import

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(false);

    try {
      const response = await api.post("/auth/register", { email, password, name });
      console.log("Signup successful:", response.data);
      setSignupSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response) {
        setSignupError(error.response.data.message || "Signup failed.");
      } else if (error.request) {
        setSignupError("No response from server.");
      } else {
        setSignupError("An error occurred during signup.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {signupError && <p className="text-red-500 mb-2">{signupError}</p>}
        {signupSuccess && <p className="text-green-500 mb-2">Signup successful! Redirecting...</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          Sign Up
        </button>
      </form>
    </div>
  );
}
