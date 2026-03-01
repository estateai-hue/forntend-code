import { useState } from "react";
import axios from "axios";

const CompanyRegister = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    gstNumber: "",
    password: "",
    plan: "free", 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // send token for auth
      await axios.post(`http://localhost:8080/api/company`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Company Created Successfully");
      setForm({
        name: "",
        address: "",
        gstNumber: "",
        password: "",
        plan: "free",
      });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating company");
    }
  };

  return (
    <div className="p-8 max-w-lg mt-0 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Register Company</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <input
          name="address"
          value={form.address}
          placeholder="Company Address"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <input
          name="gstNumber"
          value={form.gstNumber}
          placeholder="GST Number"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="business">Business</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
          Create Company
        </button>
      </form>
    </div>
  );
};

export default CompanyRegister;