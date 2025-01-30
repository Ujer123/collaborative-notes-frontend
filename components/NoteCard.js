"use client";

export default function NoteCard({ note, onEdit, onDelete, onShare }) {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">{note.title}</h2>
      <p className="text-gray-600 mb-4">{note.content}</p>
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
    </div>
  );
}
