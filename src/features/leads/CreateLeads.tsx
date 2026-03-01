import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CreateLeads = () => {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    requirement: "",
    assignedTo: "",
    companyId: "", 
  });

  const [agents, setAgents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Fetch agents (only for admin/superadmin)
  useEffect(() => {
    if (
      token &&
      (user?.role === "admin" || user?.role === "superadmin")
    ) {
      fetchAgents();
      fetchCompany();
    }
  }, [token, user]);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/agent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
   
      setAgents(res.data.agents);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompany = async()=>{
    try{
      const res = await axios.get("http://localhost:8080/api/company",
        {
          headers: {Authorization:`Bearer ${token}`}
        }
      );
      console.log("company list", res.data);
      setCompanies(res.data);
    }catch(error){
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload =
        user?.role === "agent"
          ? { ...formData } // agent auto-assigned in backend
          : { ...formData };

      const res = await axios.post(
        "http://localhost:8080/api/leads",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        console.log("lead created", res.data);
      setMessage("Lead created successfully ✅");
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        requirement: "",
        assignedTo: "",
        companyId: "", 
      });

    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error creating lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Create Lead</h2>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="clientEmail"
          placeholder="Client Email"
          value={formData.clientEmail}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="clientPhone"
          placeholder="Client Phone"
          value={formData.clientPhone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="requirement"
          placeholder="Requirement"
          value={formData.requirement}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        {/* 🔥 Assign Agent (Only Admin/Superadmin) */}
       
         <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Agent</option>

          {Array.isArray(agents) &&
            agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
        </select>
         <select
         name="companyId"
         value={formData.companyId}
         onChange={handleChange}
         className="w-full border px-4 py-2 rounded"
         >
          <option value="">Select Company</option>
          {Array.isArray(companies)&&
            companies.map((company)=>(
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          
          </select>   
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Lead"}
        </button>

      </form>
    </div>
  );
};

export default CreateLeads;