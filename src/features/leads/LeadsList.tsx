import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LeadsList = () => {
  const { token } = useAuth();

  const [leads, setLeads] = useState<any[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/leads",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status,
            search,
            page,
            limit: 10,
          },
        }
      );
      console.log("leads List", res.data);
      setLeads(res.data.leads || []); 
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeads();
    }, 400); // debounce search

    return () => clearTimeout(delay);
  }, [status, search, page]);

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">Leads List</h1>
      <button type="button" onClick={()=> navigate("/superadmin/create-leads")}>Create Leads</button>

      {/* Filters */}
      <div className="flex gap-4 mb-6">

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-4 py-2 rounded"
        />

      </div>

      {/* Leads */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead._id} className="border-t">
                  <td className="px-4 py-3">{lead.clientName}</td>
                  <td className="px-4 py-3">{lead.clientEmail}</td>
                  <td className="px-4 py-3">{lead.clientPhone}</td>
                  <td className="px-4 py-3 capitalize">
                    {lead.status}
                  </td>
                  <td className="px-4 py-3">
                    {lead.assignedTo?.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default LeadsList;