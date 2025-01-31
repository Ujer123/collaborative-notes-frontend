"use client";

import { useState } from "react";
import api from "@/utils/api"; // Pre-configured Axios instance

export default function NoteModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false); // To handle submission state
  const [error, setError] = useState(null); // To display errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      setLoading(true); // Set loading state
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      // Send the note to the backend
      await api.post(
        "/notes",
        { title, content, owner },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Note created successfully!");
      setTitle("");
      setContent("");
      setOwner("");
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error creating note:", error);
      if (error.response) {
        setError(error.response.data.message || "Failed to create note.");
      } else if (error.request) {
        setError("No response from the server. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Create Note</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            rows="4"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
              onClick={onClose}
              disabled={loading} // Prevent closing during submission
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`py-1 px-4 rounded ${
                loading
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={loading} // Prevent multiple submissions
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
