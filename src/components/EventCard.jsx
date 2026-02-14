import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import api from "../services/api";

export default function EventCard({ event, fetchEvents }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const deleteEvent = async () => {
    try {
      await api.delete(`/events/${event._id}`);
      fetchEvents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const changeLocation = () => {
    navigate(`/edit-event/${event._id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      
      {/* Event Title */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      {/* Buttons Row (Responsive) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">

        {/* Attendance */}
        <button
          onClick={() => navigate(`/attendance/${event._id}`)}
          className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          Attendance
        </button>

        {/* View QR */}
        <button
          onClick={() => navigate(`/event-qr/${event._id}`)}
          className="flex-1 sm:flex-none bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700"
        >
          View QR
        </button>

        {/* 3 Dot Menu */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            <FiMoreVertical size={20} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg z-50">
              <button
                onClick={changeLocation}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Change Location
              </button>

              <button
                onClick={deleteEvent}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
