import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Company {
  _id: string;
  name: string;
}

const AgentRegister = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  // Fetch companies (for superadmin)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/company",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanies(res.data || []);
      } catch (error) {
        console.error(error);
        alert("Error fetching companies");
      }
    };

    fetchCompanies();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompanyId) {
      return alert("Please select a company first");
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/agent/create-agent",
        {
          ...form,
          companyId: selectedCompanyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Agent ${response.data.agent.name} Created Successfully`);
      navigate("/superadmin/agents");
      // Reset form
      setForm({ name: "", email: "", password: "" });
      setSelectedCompanyId("");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating agent");
    }
  };

  return (
    <div className="p-8 max-w-lg bg-white shadow rounded-xl mt-0">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register Agent
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Agent Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Agent Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Create Agent
        </button>
      </form>
    </div>
  );
};

export default AgentRegister;