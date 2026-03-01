import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Company {
  _id: string;
  name: string;
  address?: string;
  gstNumber?: string;
  plan: {
    name: string;
    price?: number;
    duration?: string;
    leadsLimit?: number;
    support?: boolean;
  };
  planStartDate?: string;
  planExpiryDate?: string;
  leadsUsed?: number;
}

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching companies");
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting company");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Companies</h2>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={() => navigate("/superadmin/create-company")}
          >
            + Create Company
          </button>
        </div>

        {loading ? (
          <div className="text-center text-indigo-600 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">GST Number</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Leads Used</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold">{company.name}</td>
                    <td className="p-3 text-gray-600">{company.address || "-"}</td>
                    <td className="p-3 text-gray-600">{company.gstNumber || "-"}</td>
                    <td className="p-3 text-gray-600">{company.plan.name}</td>
                    <td className="p-3 text-gray-600">{company.leadsUsed || 0}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/superadmin/edit-company/${company._id}`)}
                        className="px-3 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCompany(company._id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;