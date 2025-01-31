"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";


export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("all")
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    id: "",
    email: "",
  })
  const [socket, setSocket] = useState(null);

  
    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setCurrentUser({
            id: decoded.id,
            email: decoded.email
          });
        } catch (error) {
          console.error('Invalid token:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }, [router]);

    // Set up socket connection
    useEffect(() => {
      if (!currentUser.id) return;
    
      const newSocket = io(
        process.env.NODE_ENV === "development" 
          ? "http://localhost:5000" 
          : "https://workverse-backend.onrender.com/api",
        { transports: ['websocket'], withCredentials: true }
      );
      
      setSocket(newSocket);
    
      newSocket.emit("join-user", currentUser.id);
    
      newSocket.on("note-updated", (updatedNote) => {
        setNotes(prevNotes => prevNotes.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        ));
      });
    
      return () => {
        newSocket.disconnect();
      };
    }, [currentUser.id]);

      const fetchNotes = async () => {
        try {
          const { data } = await api.get("/notes", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setNotes(data);
          setRefresh(!refresh)
        } catch (error) {
          console.error("Error fetching notes:", error);
          if (error.response?.status === 401) {
            router.push("/login");
          }
        }
      };

  useEffect(() => {
    fetchNotes();
  }, [refresh]);

   // Create new note
   const createNote = async (note) => {
    try {
      await api.post("/notes", note, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes();
      setRefresh(!refresh)
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (note) => {
    const updatedTitle = prompt("Edit Title:", note.title);
    const updatedContent = prompt("Edit Content:", note.content);

    if (updatedTitle || updatedContent) {
      try {
        const { data } = await api.put(
          `/notes/${note._id}`,
          { title: updatedTitle, content: updatedContent },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        // if (socket) {
        //   socket.emit("update-note", {noteId: note._id, updatedContent: data});
        // }
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n._id === data._id ? data : n))
        );
        setRefresh(!refresh)
        console.log("Note updated successfully");
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes();
      setRefresh(!refresh)
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  
  const shareNote = async (note) => {
    const recipientEmail = prompt("Enter the email of the user you want to share this note with:");

    if (recipientEmail) {
      try {
        const { data } = await api.post(
          "/notes/share",
          { noteId: note._id, recipientEmail },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (data.success) {
          alert(`Note shared successfully with ${recipientEmail}`);
          setRefresh(!refresh);
        } else {
          alert(data.message || `Failed to share the note with ${recipientEmail}.`);
        }
      } catch (error) {
        console.error("Error sharing note:", error.response?.data || error.message);
        if (error.response?.status === 400) {
          alert(error.response?.data?.error || "Invalid recipient email");
        } else if (error.response?.status === 403) {
          alert("You don't have permission to share this note.");
        } else {
          alert("Failed to share the note. Please try again later.");
        }
      }
    }
  };
  
   const removeCollaborator = async (noteId, email) => {
    try {
      await api.delete(`/notes/${noteId}/remove-collaborator`, {
        data: { email },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing collaborator:", error);
      alert(error.response?.data?.error || "Failed to remove collaborator");
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                          note.content.toLowerCase().includes(search.toLowerCase());
  
    const ownerId = note.owner?._id ? note.owner._id.toString() : note.owner?.toString();
    const isOwner = ownerId === currentUser._id;

    const isShared = note.sharedWith?.some(sw => {
       const sharedUserId = sw.user?._id ? sw.user._id.toString() : sw.user?.toString();
    return sharedUserId === currentUser.id;
    });
  
    if (filter === "created") {
      return matchesSearch && !isOwner && !isShared;
    }
  
    if (filter === "shared") {
      return matchesSearch && isShared && !isOwner;
    }
  
    return matchesSearch;
  });
  

  return (
    <div className="p-6">
      <Navbar/>
      <NoteForm onSubmit={createNote} />
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 border rounded w-full"
      />
       <button
            onClick={() => setFilter("all")}
            className={`p-2 border rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            All
          </button>
       <button
            onClick={() => setFilter("created")}
            className={`p-2 border rounded ${filter === "created" ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            Created by Me
          </button>
          <button
            onClick={() => setFilter("shared")}
            className={`p-2 border rounded ${filter === "shared" ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            Shared with Me
          </button>
      <ul>

      {filteredNotes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              currentUser={currentUser}
              onEdit={updateNote}
              onDelete={() => deleteNote(note._id)}
              onShare={shareNote}
              onRemoveCollaborator={(email) => removeCollaborator(note._id, email)}
            />
          ))}


</ul>
    </div>
  );
}
