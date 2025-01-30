"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

    // Check for authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login"); // Redirect to login page if no token
        }
      }, [router]);

      const fetchNotes = async () => {
        try {
          const { data } = await api.get("/notes", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setNotes(data);
        } catch (error) {
          console.error("Error fetching notes:", error);
          // Redirect to login page if the token is invalid or expired
          if (error.response?.status === 401) {
            router.push("/login");
          }
        }
      };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(search.toLowerCase())|| note.title.toLowerCase().includes(search.toLowerCase())
  );

  const onEdit = async (note) => {
    const updatedTitle = prompt("Edit Title:", note.title);
    const updatedContent = prompt("Edit Content:", note.content);

    if (updatedTitle && updatedContent) {
      try {
        const { data } = await api.put(
          `/notes/${note._id}`,
          { title: updatedTitle, content: updatedContent },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n._id === data._id ? data : n))
        );
        console.log("Note updated successfully");
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  // Handler for deleting a note
  const onDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      console.log("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Handler for sharing a note
  const onShare = async (note) => {
    const recipientEmail = prompt("Enter the email of the user you want to share this note with:");
  
    if (recipientEmail) {
      try {
        const { data } = await api.post(
          `/notes/share`,
          { noteId: note._id, recipientEmail },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        alert(`Note shared successfully with ${recipientEmail}`);
        console.log("Share response:", data);
      } catch (error) {
        console.error("Error sharing note:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Failed to share the note. Please try again.");
      }
    }
  };
  
  
  

  return (
    <div className="p-6">
      <Navbar/>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 border rounded w-full"
      />
      <ul>
        {filteredNotes.map((note) => (
          <li key={note._id} className="p-2 bg-gray-100 rounded mb-2">
            
            <NoteCard
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
