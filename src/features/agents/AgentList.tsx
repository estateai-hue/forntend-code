import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Agent {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AgentList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data.agents || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/agent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(agents.filter((agent) => agent._id !== id));
      alert("Agent deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting agent");
    }
  };

  return (
    <div className="bg-white p-6 shadow-xl rounded-2xl max-w-5xl mx-auto mt-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Agents</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => navigate("/superadmin/create-agent")}
        >
          + Create Agent
        </button>
      </div>

      {loading ? (
        <p>Loading agents...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No agents found
                  </td>
                </tr>
              )}
              {agents.map((agent) => (
                <tr className="border-t hover:bg-gray-50 transition" key={agent._id}>
                  <td className="p-3 font-semibold">{agent.name}</td>
                  <td className="p-3 font-semibold">{agent.email}</td>
                  <td className="p-3 font-semibold">{agent.role}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => navigate(`/superadmin/edit-agent/${agent._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(agent._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentList;