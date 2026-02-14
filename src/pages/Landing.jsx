import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center 
                    bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700
                    text-white relative overflow-hidden">

      {/* Background Glow Effect */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-400/10 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
          GDG Attendance Portal
        </h1>

        {/* Highlight Line */}
        <div className="w-32 h-1 bg-white mx-auto rounded-full mb-6"></div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 mb-10">
          Smart QR-based Attendance with Secure Geofencing
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center">

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl 
                       bg-white text-indigo-700 font-semibold
                       hover:scale-105 hover:shadow-2xl
                       transition-all duration-300"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl 
                       border border-white/40 bg-white/10 backdrop-blur-lg
                       hover:bg-white/20 hover:scale-105
                       transition-all duration-300"
          >
            Login
          </button>

        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-white/60">
        © {new Date().getFullYear()} GDG Attendance System
      </p>
    </div>
  );
}





