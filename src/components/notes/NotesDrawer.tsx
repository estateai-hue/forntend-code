import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesDrawer({ leadId, isOpen, onClose }: Props) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) fetchNotes();
  }, [isOpen]);

 const fetchNotes = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/leads/${leadId}/notes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ FIX HERE
    setNotes(res.data.notes || []);
  } catch (error) {
    console.log(error);
    setNotes([]); // prevent map error
  }
};

const handleAddNote = async () => {
  if (!newNote.trim()) return;

  try {
    const res = await axios.post(
      `http://localhost:8080/api/leads/${leadId}/notes`,
      { note: newNote },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ FIX HERE
    setNotes((prev) => [res.data.note, ...prev]);

    setNewNote("");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lead Notes</h2>
          <button onClick={onClose}><i className="fa-solid fa-x"></i></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[60%]">
            {notes.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                No Notes Available
                </div>
            ) : (
                notes.map((note) => (
                <div key={note._id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">
                    {note.agentId?.name} •{" "}
                    {new Date(note.createdAt).toLocaleString()}
                    </p>
                </div>
                ))
            )}
        </div>

        <div className="p-4 border-t fixed bottom-2 w-full bg-white">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Write a note..."
          />
          <button
            onClick={handleAddNote}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
          >
            Add Note
          </button>
        </div>
      </div>
    </>
  );
}