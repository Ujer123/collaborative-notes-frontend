"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm";


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

    // Check for authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
        if (!token) {
          router.push("/login"); // Redirect to login page if no token
        }else{
          setCurrentUser({id: userId, email: userEmail});
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
  }, [refresh]);

   // Create new note
   const createNote = async (note) => {
    try {
      await api.post("/notes", noteData, {
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

  // Delete note
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

  // Share note with another user
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
  
   // Remove collaborator
   const removeCollaborator = async (noteId, email) => {
    try {
      await api.delete(`/notes/${noteId}/collaborators`, {
        data: { email },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes();
      setRefresh(!refresh)
    } catch (error) {
      console.error("Error removing collaborator:", error);
      alert(error.response?.data?.error || "Failed to remove collaborator");
    }
  };

  // Filter notes based on current filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                         note.content.toLowerCase().includes(search.toLowerCase());

    if (filter === "created") {
      return matchesSearch;
    }
    if (filter === "shared") {
      return (
        matchesSearch &&
        note.sharedWith?.some((user) => user.email === currentUser.email)
      );
    }
    return matchesSearch;
  });

  // const userNotes = notes.filter((note) => note.owner === currentUser.id);

  // const filteredNotes = notes
  // .filter((note) => {    
  //   const matchesSearch =
  //     (note.content ?? "").toLowerCase().includes(search.toLowerCase()) ||
  //     (note.title ?? "").toLowerCase().includes(search.toLowerCase());

  //   if (filter === "created") {
  //     return matchesSearch;
  //   } else if (filter === "shared") {
  //     return (
  //       matchesSearch &&
  //       note.sharedWith?.some((user) => user.email === currentUser.email) // Assuming `sharedWith` contains user objects with `email`
  //     );
  //   } else {
  //     return matchesSearch;
  //   }
  // });


  const onEdit = async (note) => {
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

  
  const onDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setRefresh(!refresh);
      console.log("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  
  const onShare = async (note) => {
    const recipientEmail = prompt("Enter the email of the user you want to share this note with:");
  
    if (recipientEmail) {
      try {
        const { data } = await api.post(
          `/notes/share`, // Your share API endpoint
          { noteId: note._id, recipientEmail }, // Send noteId and recipient's email
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        if (data.success) {  // Check for success from the server
          alert(`Note shared successfully with ${recipientEmail}`);
          console.log("Share response:", data);
          setRefresh(!refresh); // Refresh to reflect changes (e.g., collaborator list)
        } else {
          // Handle specific error messages from the server (if any)
          alert(data.message || `Failed to share the note with ${recipientEmail}.`);
        }
  
      } catch (error) {
        console.error("Error sharing note:", error.response?.data || error.message);
  
        // More informative error handling
        if (error.response?.status === 400) { // Example: Bad Request
          alert(error.response?.data?.error || "Invalid recipient email or other input.");
        } else if (error.response?.status === 403) { // Example: Forbidden
          alert("You don't have permission to share this note.");
        } else {
          alert("Failed to share the note. Please try again later.");
        }
      }
    }
  };

  // Handler for removing a collaborator
  const handleRemoveCollaborator = async (noteId, email) => {
    if (window.confirm(`Are you sure you want to remove ${email} as a collaborator?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to be logged in to remove collaborators.");
          router.push("/login");
          return;
        }
  
        // Log inputs for debugging
        console.log("Token:", token);
        console.log("Request Body:", { noteId, email });
  
        // Send request to remove collaborator
        const { data } = await api.delete(`/notes/remove-collaborator`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { noteId, email }, // Comment this if not supported by the API
        });
  
        if (data.success) {
          alert("Collaborator removed successfully.");
          setRefresh(!refresh); // Refresh the notes to reflect changes
        } else {
          alert(data.message || "Failed to remove collaborator.");
        }
      } catch (error) {
        console.error("Error removing collaborator:", error);
        if (error.response) {
          console.error("Response error:", error.response);
          alert("Error: " + (error.response.data?.message || error.message));
        } else {
          alert("Failed to remove the collaborator. Please try again later.");
        }
      }
    }
  };
  
  

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
