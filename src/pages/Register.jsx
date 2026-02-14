
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);

      alert(
        form.role === "member"
          ? "Registration successful. Please login."
          : "Registration successful. Await admin approval."
      );

      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">

      <form
        onSubmit={submit}
        className="backdrop-blur-xl bg-white/20 border border-white/30
                   shadow-2xl rounded-2xl px-10 py-12 w-96 text-white"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          Create Account ✨
        </h2>

        <p className="text-center text-sm mb-8 text-white/80">
          Join the QR Attendance System
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Full Name</label>
          <input
            name="name"
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-lg bg-white/20
                       border border-white/30 placeholder-white/70
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-white/20
                       border border-white/30 placeholder-white/70
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg bg-white/20
                       border border-white/30 placeholder-white/70
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="mb-8">
          <label className="block text-sm mb-2">Select Role</label>
          <select
            name="role"
            className="w-full px-4 py-3 rounded-lg bg-white/20
                       border border-white/30 text-white
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={handleChange}
          >
            <option value="member" className="text-black">
              Member
            </option>
            <option value="pr" className="text-black">
              PR Team
            </option>
            <option value="admin" className="text-black">
              Admin
            </option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-white text-indigo-700
                     font-semibold hover:scale-105
                     hover:shadow-xl transition-all duration-300"
        >
          Register
        </button>

        <p className="text-xs text-center mt-6 text-white/70">
          Secure QR Attendance System
        </p>
      </form>
    </div>
  );
}
