"use client";

import { useState } from "react";
import NoteModal from './NoteModal';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold cursor-pointer">Collaborative Notes</h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200"
            onClick={() => setIsModalOpen(true)}
          >
            Create Note
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
