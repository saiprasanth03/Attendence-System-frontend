import React, { useEffect, useState } from "react";
import api from "../services/api";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PRDashboard() {
  const navigate = useNavigate();

  const [activeEvent, setActiveEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const activeRes = await api.get("/events/active");
      setActiveEvent(activeRes.data);

      const eventsRes = await api.get("/events/all");
      setEvents(eventsRes.data);

      // Fetch attendance count per event
      const counts = {};
      for (let event of eventsRes.data) {
        const attRes = await api.get(
          `/attendance/event/${event._id}`
        );
        counts[event._id] = attRes.data.length;
      }

      setAttendanceCounts(counts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // QR ROTATION
  // ===============================
  useEffect(() => {
    if (!activeEvent) return;

    const interval = setInterval(() => {
      const timeWindow = Math.floor(Date.now() / 50000);
      setQrValue(`${activeEvent._id}-${timeWindow}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEvent]);

  return (
    // <div className="min-h-screen bg-gray-100 pt-24 px-8">
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">

      <Navbar />

      <h1 className="text-3xl font-bold mb-8">
        PR Dashboard
      </h1>

      {/* ================= ACTIVE EVENT ================= */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Active Event
        </h2>

        {!activeEvent ? (
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">
              No active event currently
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-4">
              {activeEvent.title}
            </h3>

            <QRCode
              value={qrValue}
              size={250}
              className="m-auto"
            />

            <p className="mt-4 text-gray-500 text-sm">
              QR changes every 50 seconds
            </p>

            <button
              onClick={() =>
                navigate(`/attendance/${activeEvent._id}`)
              }
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Attendance
            </button>
          </div>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-gray-500">Total Events</h4>
          <p className="text-2xl font-bold">
            {events.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-gray-500">
            Active Event
          </h4>
          <p className="text-2xl font-bold">
            {activeEvent ? 1 : 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-gray-500">
            Total Attendance (All Events)
          </h4>
          <p className="text-2xl font-bold">
            {Object.values(attendanceCounts).reduce(
              (a, b) => a + b,
              0
            )}
          </p>
        </div>
      </div>

      {/* ================= EVENTS TABLE ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          All Events
        </h2>

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="bg-white shadow rounded p-6 overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">
                    Attendance Count
                  </th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="p-2 border">
                      {event.title}
                    </td>
                    <td className="p-2 border capitalize">
                      {event.type}
                    </td>
                    <td className="p-2 border">
                      {new Date(
                        event.date
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      {attendanceCounts[event._id] || 0}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() =>
                          navigate(
                            `/event-attendance/${event._id}`
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
