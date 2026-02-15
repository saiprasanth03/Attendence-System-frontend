
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MemberDashboard() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [myAttendance, setMyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveEvent();
    fetchMyAttendance();
  }, []);

  const fetchActiveEvent = async () => {
    try {
      const res = await api.get("/events/active");

      // Backend returns SINGLE object or null
      if (res.data && res.data._id) {
        setActiveEvent(res.data);
      } else {
        setActiveEvent(null);
      }

    } catch (err) {
      console.error("Active event error:", err);
      setActiveEvent(null);
    }
  };



  const fetchMyAttendance = async () => {
    try {
      const res = await api.get("/attendance/my");
      setMyAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STATISTICS
  // ===============================
  const totalAttended = myAttendance.length;
  const lastAttended =
    myAttendance.length > 0
      ? new Date(myAttendance[0].timestamp).toLocaleDateString()
      : "N/A";

  const attendancePercentage =
    totalAttended > 0 ? Math.min(totalAttended * 10, 100) : 0;


  return (
    <div className="min-h-screen bg-gray-100 pt-[70px]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* ===============================
            STATS SECTION
        =============================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded p-6 text-center">
            <p className="text-gray-500">Total Events Attended</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalAttended}
            </p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center">
            <p className="text-gray-500">Last Attended</p>
            <p className="text-2xl font-semibold">
              {lastAttended}
            </p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center">
            <p className="text-gray-500">Attendance Score</p>
            <p className="text-3xl font-bold text-green-600">
              {attendancePercentage}%
            </p>
          </div>

        </div>

        {/* ===============================
            ACTIVE EVENT CARD
        =============================== */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow rounded p-8 flex flex-col sm:flex-row justify-between items-center gap-6">

          <div>
            <h2 className="text-2xl font-bold mb-2">
              {activeEvent
                ? activeEvent.title
                : "No Active Event"}
            </h2>

            {activeEvent && (
              <>
                <p>
                  {new Date(activeEvent.date).toLocaleDateString()}
                </p>
                <p className="capitalize">
                  {activeEvent.type}
                </p>
              </>
            )}
          </div>

          <button
            disabled={!activeEvent}
            onClick={() => navigate("/scan")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeEvent
                ? "bg-white text-blue-600 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Scan QR
          </button>

        </div>

        {/* ===============================
            ATTENDANCE HISTORY
        =============================== */}
        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              My Attendance History
            </h2>

          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : myAttendance.length === 0 ? (
            <p className="text-gray-500">
              You haven't attended any events yet
            </p>
          ) : (
            <div className="space-y-4">
              {myAttendance.map((record) => (
                <div
                  key={record._id}
                  className="border p-4 rounded flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold">
                      {record.eventId?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {record.address}
                    </p>
                  </div>

                  <span className="text-green-600 font-semibold">
                    ✓ Present
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
