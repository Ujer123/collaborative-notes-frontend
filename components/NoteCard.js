"use client";
import React, {useState} from 'react';
import { jwtDecode } from "jwt-decode"; 

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onShare,
  onRemoveCollaborator,
}) {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  
  const token = localStorage.getItem("token");
  let currentUser = null;

  if (token) {
    try {
      currentUser = jwtDecode(token); 
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const isOwner = currentUser && (
    (typeof note.owner === "object" ? note.owner._id : note.owner) === currentUser.id
  );
   const isShared = note.sharedWith?.length > 0 


  return (
    <>
    <div className="border p-4 rounded shadow-md bg-white mb-4">
      <div className="mb-2">
        <small className="text-gray-500">
        {isShared ? (
            <p className="text-gray-500">
              Owned by {typeof note.owner === "object" ? note.owner.email : "another user"}
            </p>
          ) : (
            <p className="text-gray-500">Owned by you</p>
          )}
        </small>
      </div>

      <h2 className="text-lg font-bold mb-2">{note.title}</h2>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>

      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <p>Created on: {formatDateTime(note.createdAt)}</p>
        {note.updatedAt && (
          <p>Last updated: {formatDateTime(note.updatedAt)}</p>
        )}
      </div>

      {isShared && (
        <div className="text-sm text-gray-500 mb-4">
          <p className="font-medium">Shared with:</p>
          <ul className="list-disc pl-5">
            {note.sharedWith.map((collaborator, index) => (
              <li key={index}>
                {collaborator.user.email}{" "}
                {isOwner && (
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => onRemoveCollaborator(collaborator.user.email)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
        <div className="flex gap-2">
        {isOwner ? (
          <>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              onClick={() => onDelete(note._id)}
            >
              Delete
            </button>
            <button
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              onClick={() => onShare(note)}
            >
              Share
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
        )}
        </div>
    </div>
    
    </>
    
  );
}
