"use client";

import { jwtDecode } from "jwt-decode"; // You can use a library like jwt-decode to decode the token.

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

  // Decode token from localStorage
  const token = localStorage.getItem("token");
  let currentUser = null;

  if (token) {
    try {
      currentUser = jwtDecode(token); // Extract user information from the token
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const isOwner =
    currentUser &&
    (typeof note.owner === "object" ? note.owner._id : note.owner) ===
      currentUser.id;

      // Check if the note is shared
  const isShared = note.sharedWith?.length > 0;

  // Determine if the current user can edit/delete/share
  const canEditDeleteShare = isOwner && isShared;

  return (
    <>{canEditDeleteShare ? <div className="border p-4 rounded shadow-md bg-white mb-4">
      {/* Ownership Information */}
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

      {/* Note Title */}
      <h2 className="text-lg font-bold mb-2">{note.title}</h2>

      {/* Note Content */}
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>

      {/* Timestamps */}
      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <p>Created on: {formatDateTime(note.createdAt)}</p>
        {note.updatedAt && (
          <p>Last updated: {formatDateTime(note.updatedAt)}</p>
        )}
      </div>

      {/* Shared Collaborators */}
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
                    onClick={() =>
                      onRemoveCollaborator(note._id, collaborator.user._id)
                    }
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      
      
        <div className="flex gap-2">
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
        </div>
      
      
    </div> : 
    <div className="border p-4 rounded shadow-md bg-white mb-4">
    {/* Ownership Information */}
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

    {/* Note Title */}
    <h2 className="text-lg font-bold mb-2">{note.title}</h2>

    {/* Note Content */}
    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>

    {/* Timestamps */}
    <div className="text-sm text-gray-500 space-y-1 mb-4">
      <p>Created on: {formatDateTime(note.createdAt)}</p>
      {note.updatedAt && (
        <p>Last updated: {formatDateTime(note.updatedAt)}</p>
      )}
    </div>

    {/* Shared Collaborators */}
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
                  onClick={() =>
                    onRemoveCollaborator(note._id, collaborator.user._id)
                  }
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
      </div>
    )}

    {/* Action Buttons */}
    
    
      
    
    
  </div>
    }</>
    
  );
}
