import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface Props {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
}


export default function ScheduleVisitModal({
  propertyId,
  isOpen,
  onClose,
}: Props) {

  const token = localStorage.getItem("token");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    visitDate: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
          "http://localhost:8080/api/site-visits",
          {
            propertyId,
            ...form,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      alert("Visit Scheduled Successfully ✅");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Schedule Visit</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            name="visitDate"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Submit
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}