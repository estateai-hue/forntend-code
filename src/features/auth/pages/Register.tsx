import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="grid grid-cols-1 gap-5">

          <input
            name="name"
            placeholder="Full Name"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
          />

          <button
            className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </button>
          <button type="button" onClick={()=> navigate("/login")}>Already have account? Login</button>
        </form>
      </div>
    </div>
  );
};

export default Register;