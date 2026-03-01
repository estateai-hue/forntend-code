import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAgent = () => {
  const { id } = useParams(); // agent id from URL
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch agent data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/agent/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForm({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Error fetching agent");
        setLoading(false);
      }
    };

    if (id) fetchAgent();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8080/api/agent/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Agent updated successfully");
      navigate("/superadmin/agents");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating agent");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 max-w-lg bg-white shadow rounded-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Update Agent
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Leave blank to keep current password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Agent
        </button>
      </form>
    </div>
  );
};

export default UpdateAgent;