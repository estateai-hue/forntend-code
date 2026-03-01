import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateCompany = () => {
 const { id } = useParams(); // get id from route
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    address: "",
    gstNumber: "",
    plan: "basic",
  });

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/company/${id}`,
              {
                headers: {
                Authorization: `Bearer ${token}`, // send token
                },
            }
        ); // get company by id
        setForm({
          name: res.data.name || "",
          address: res.data.address || "",
          gstNumber: res.data.gstNumber || "",
          plan: res.data.plan?.name || "basic",
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching company");
      }
    };

    fetchCompany();
  }, [id]);

   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/company/${id}`, form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token
          },
        }
      ); // send PUT request with company id
      alert("Company updated successfully");
      navigate("/superadmin/companies"); // redirect to list
    } catch (err) {
      console.error(err);
      alert("Error updating company");
    }
  };

//   if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
    <div className="p-8 max-w-lg bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Update Company</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          value={form.address}
          placeholder="Address"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="gstNumber"
          value={form.gstNumber}
          placeholder="GST Number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="business">Business</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Update Company
        </button>
      </form>
    </div>
  );

};

export default UpdateCompany;