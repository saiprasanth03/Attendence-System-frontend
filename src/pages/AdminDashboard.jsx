import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [openMenu, setOpenMenu] = useState(null);


  const navigate = useNavigate();

  // ===============================
  // FETCH PENDING USERS
  // ===============================
  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/pending");
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching pending users");
    }
  };

  // ===============================
  // FETCH ALL ATTENDANCE
  // ===============================
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/all");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // FETCH ALL EVENTS
  // ===============================
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/all");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // FETCH EVENT-WISE ATTENDANCE
  // ===============================
  const fetchEventAttendance = async (eventId, title) => {
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      setSelectedAttendance(res.data);
      setSelectedEventTitle(title);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // APPROVE USER
  // ===============================
  const approveUser = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      alert("User approved");
      fetchPending();
    } catch (err) {
      alert("Approval failed");
    }
  };
  // ===============================
  // disableEvent
  // ===============================
  const disableEvent = async (id) => {
    try {
      await api.put(`/events/disable/${id}`);
      alert("Event disabled successfully");

      // refresh list
      fetchEvents();

    } catch (err) {
      console.error(err);
      alert("Failed to disable event");
    }
  };


  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    fetchPending();
    fetchAttendance();
    fetchEvents();
  }, []);

 

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 pt-[90px]"> Admin Dashboard</h1>

      {/* ===============================
          CREATE EVENT BUTTON
      =============================== */}
      <button
        onClick={() => navigate("/create-event")}
        className="bg-blue-600 text-white px-4 py-2 mb-6 rounded hover:bg-blue-700"
      >
        Create Event
      </button>

      {/* ===============================
          PENDING APPROVALS
      =============================== */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl mb-4 font-semibold">
          Pending Member & PR Approvals
        </h2>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending users</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-400 capitalize">
                    Role: {user.role}
                  </p>
                </div>

                <button
                  onClick={() => approveUser(user._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===============================
          EVENTS SECTION
      =============================== */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl mb-4 font-semibold">All Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events created</p>
        ) : (
          <div className="space-y-4">

            {events.map((event) => (
            <div
              key={event._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-4 rounded mb-4"
            >
              {/* Event Info */}
              <div>
                <p className="font-semibold text-lg">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center gap-2 mt-3 sm:mt-0">

                {/* Attendance */}
                <button
                  onClick={() => navigate(`/event-attendance/${event._id}`)}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  Attendance
                </button>

                {/* View QR */}
                <button
                  onClick={() => navigate(`/create-event/${event._id}`)}
                  className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700"
                >
                  View QR
                </button>

                {/* 3 Dots Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === event._id ? null : event._id)
                    }
                    className="text-gray-600 hover:text-black text-xl px-2"
                  >
                    ⋮
                  </button>

                  {openMenu === event._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                      
                      <button
                        onClick={async () => {
                          const confirmDelete = window.confirm("Delete this event?");
                          if (!confirmDelete) return;

                          try {
                            await api.delete(`/events/${event._id}`);
                            alert("Event deleted");
                            fetchEvents();
                          } catch (err) {
                            alert("Delete failed");
                          }

                          setOpenMenu(null); // close menu after action
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Delete Event
                      </button>

                      <button
                        onClick={() => {
                          navigate(`/edit-location/${event._id}?editLocation=true`);
                          setOpenMenu(null); // close menu
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Change Location
                      </button>
                      <button
                        onClick={() => disableEvent(event._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Disable Event
                      </button>

                    </div>
                  )}
                </div>


              </div>
            </div>
          ))}


          </div>
        )}
      </div>

      {/* ===============================
          EVENT-WISE ATTENDANCE TABLE
      =============================== */}
      {selectedAttendance.length > 0 && (
        <div className="bg-white shadow rounded p-6 mt-8">
          <h2 className="text-xl mb-4 font-semibold">
            Attendance for: {selectedEventTitle}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttendance.map((record) => (
                  <tr key={record._id} className="border-t">
                    <td className="p-2">{record.userId?.name}</td>
                    <td className="p-2">{record.userId?.email}</td>
                    <td className="p-2 capitalize">
                      {record.userId?.role}
                    </td>
                    <td className="p-2">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
