import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import NotesDrawer from "../../components/notes/NotesDrawer";

const AssignedLeads = () => {
  const { token, user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const fetchAssignedLeads = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/leads/assigned",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            assignedTo: user?._id,  // 🔥 important
            page,
            limit: 10,
            search,
            status,
          },
        }
      );

      setLeads(res.data.leads || []);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?._id) {
      fetchAssignedLeads();
    }
  }, [token, user]);

    useEffect(() => {
    const delay = setTimeout(() => {
      fetchAssignedLeads();
    }, 400); // debounce search

    return () => clearTimeout(delay);
  }, [status, search, page]);


  
  const handleStatusChange = async (leadId: string, newStatus: string)=>{
    try{
      setUpdatingId(leadId);
      await axios.patch(
        `http://localhost:8080/api/leads/${leadId}/status`,
        {status: newStatus},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      setLeads((prev)=>
        prev.map((leads)=>
        leads._id === leadId
        ?{...leads, status: newStatus}: leads
       )
     );

    }catch(error){
      console.log(error);
    }finally{
      setUpdatingId(null);
    }
  }

const getStatusStyle = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "contacted":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-300";
    case "closed":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

  if (loading) return <p>Loading assigned leads...</p>;

  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">
        My Assigned Leads
      </h2>
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
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Notes</th>
          </tr>
        </thead>

        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead._id} className="border-t">
                <td className="px-4 py-2">{lead.clientName}</td>
                <td className="px-4 py-2">{lead.clientEmail}</td>
                <td className="px-4 py-2 capitalize">
                  <div className="relative inline-block">
                    <select
                        value={lead.status}
                        disabled={updatingId === lead._id}
                        onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                        }
                        className={`appearance-none cursor-pointer px-4 py-1 pr-8 rounded-full text-sm font-semibold border 
                        ${getStatusStyle(lead.status)}
                        `}
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="overdue">Overdue</option>
                        <option value="closed">Closed</option>
                    </select>

                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                        <i className="fa-solid fa-chevron-down"></i>
                    </span>
                 </div>
                </td>
                <td className="px-4 py-2 capitliaze">
                    <button onClick={() => setSelectedLead(lead._id)}><i className="fa-solid fa-list"></i></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No assigned leads
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
      <NotesDrawer
        leadId={selectedLead || ""}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        />
    </div>
  );
};

export default AssignedLeads;