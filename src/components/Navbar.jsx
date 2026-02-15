
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // return (
  //   <div className="
  //     fixed rounded-[10px] top-[10px] left-0 w-[96%] z-50 ml-[2%]
  //     backdrop-blur-xl bg-white/30
  //     border-b border-white/20
  //     shadow-sm 
  //   ">
  //     <div className="px-8 py-4 flex justify-between items-center">

  //       {/* Left Section */}
  //       <div>
  //         <h2 className="text-xl font-bold text-gray-800">
  //           Welcome back,{" "}
  //           <span className="text-blue-600">{name}</span> 👋
  //         </h2>
  //         <p className="text-sm text-gray-600 capitalize tracking-wide">
  //           {role}
  //         </p>
  //       </div>

  //       {/* Right Section */}
  //       <div className="relative" ref={dropdownRef}>

  //         {/* Profile Circle */}
  //         <button
  //           onClick={() => setOpen(!open)}
  //           className="
  //             w-10 h-10 rounded-full 
  //             bg-blue-600 text-white font-semibold 
  //             flex items-center justify-center 
  //             hover:bg-blue-700 transition
  //             shadow-md
  //           "
  //         >
  //           {name ? name.charAt(0).toUpperCase() : "U"}
  //         </button>

  //         {/* Dropdown */}
  //         {open && (
  //           <div className="
  //             absolute right-0 mt-3 w-48
  //             backdrop-blur-lg bg-white/80
  //             shadow-xl rounded-xl border
  //             overflow-hidden
  //           ">

  //             <div className="px-4 py-3 border-b">
  //               <p className="font-semibold text-gray-800">{name}</p>
  //               <p className="text-sm text-gray-500 capitalize">{role}</p>
  //             </div>

  //             <button
  //               onClick={handleLogout}
  //               className="
  //                 w-full text-left px-4 py-3
  //                 hover:bg-red-50 text-red-600 transition
  //               "
  //             >
  //               Logout
  //             </button>
  //           </div>
  //         )}

  //       </div>
  //     </div>
  //   </div>
  // );

return (
  <div className="
    fixed top-0 left-0 w-full z-50
    backdrop-blur-xl bg-white/60
    border-b border-white/20
    shadow-sm
  ">
    <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center ">

      {/* Left */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Welcome back,{" "}
          <span className="text-blue-600">{name}</span> 👋
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 capitalize">
          {role}
        </p>
      </div>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="
            w-9 h-9 sm:w-10 sm:h-10
            rounded-full bg-blue-600
            text-white font-semibold
            flex items-center justify-center
            hover:bg-blue-700 transition
          "
        >
          {name ? name.charAt(0).toUpperCase() : "U"}
        </button>

        {open && (
          <div className="
            absolute right-0 mt-3 w-48
            backdrop-blur-lg bg-white/90
            shadow-xl rounded-xl border
            overflow-hidden
          ">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-500 capitalize">{role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="
                w-full text-left px-4 py-3
                hover:bg-red-50 text-red-600 transition
              "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);


}
