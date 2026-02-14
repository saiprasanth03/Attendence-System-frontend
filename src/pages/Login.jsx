
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "pr") navigate("/pr");
      else navigate("/member");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">

      <form
        onSubmit={login}
        className="backdrop-blur-xl bg-white/20 border border-white/30 
                   shadow-2xl rounded-2xl px-10 py-12 w-96 
                   text-white"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          Welcome Back 👋
        </h2>

        <p className="text-center text-sm mb-8 text-white/80">
          Login to your account
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-white/20 
                       border border-white/30 placeholder-white/70
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-sm mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 
                       border border-white/30 placeholder-white/70
                       focus:outline-none focus:ring-2 focus:ring-white
                       transition"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          className="w-full py-3 rounded-lg bg-white text-indigo-700 
                     font-semibold hover:scale-105 
                     hover:shadow-xl transition-all duration-300"
        >
          Login
        </button>

        <p className="text-xs text-center mt-6 text-white/70">
          Secure QR Attendance System
        </p>
      </form>
    </div>
  );
}

