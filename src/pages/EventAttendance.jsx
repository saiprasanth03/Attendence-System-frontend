import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function EventAttendance() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // ===============================
  // FETCH ATTENDANCE
  // ===============================
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      setAttendance(res.data);

      if (res.data.length > 0) {
        setEventTitle(res.data[0].eventId?.title || "Event");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FILTER RECORDS
  // ===============================
  const filteredAttendance = useMemo(() => {
    if (!search) return attendance;

    return attendance.filter((record) => {
      const name = record.userId?.name || "";
      const email = record.userId?.email || "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, attendance]);

  // ===============================
  // COUNT TOTAL MATCHES
  // ===============================
  useEffect(() => {
    if (!search) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    let count = 0;
    const regex = new RegExp(search, "gi");

    attendance.forEach((record) => {
      const name = record.userId?.name || "";
      const email = record.userId?.email || "";

      count += (name.match(regex) || []).length;
      count += (email.match(regex) || []).length;
    });

    setTotalMatches(count);
    setCurrentMatchIndex(0);
  }, [search, attendance]);

  // ===============================
  // NAVIGATION
  // ===============================
  const goToNext = () => {
    if (totalMatches === 0) return;
    setCurrentMatchIndex((prev) =>
      prev + 1 >= totalMatches ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    if (totalMatches === 0) return;
    setCurrentMatchIndex((prev) =>
      prev - 1 < 0 ? totalMatches - 1 : prev - 1
    );
  };

  // ===============================
  // HIGHLIGHT FUNCTION (CORRECT)
  // ===============================
  const highlightText = (() => {
    let matchCounter = -1;

    return (text) => {
      if (!search) return text;

      const regex = new RegExp(`(${search})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) => {
        if (part.toLowerCase() === search.toLowerCase()) {
          matchCounter++;
          const isActive = matchCounter === currentMatchIndex;

          return (
            <span
              key={index}
              className={`px-1 rounded ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-yellow-300"
              }`}
            >
              {part}
            </span>
          );
        }
        return part;
      });
    };
  })();
const handleExport = async () => {
  try {
    const res = await api.get(
      `/attendance/export/${eventId}`,
      {
        responseType: "blob", // IMPORTANT
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
    alert("Export failed");
  }
};

  // Reset match counter before every render
  useEffect(() => {
    // this forces highlightText to reset properly
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 pt-[100px]">

        {/* BACK + SEARCH */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-fit"
          >
            Back
          </button>



          <div className="flex items-center gap-3">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {search && (
              <>
                <span className="text-sm text-gray-600">
                  {totalMatches > 0
                    ? `${currentMatchIndex + 1} / ${totalMatches}`
                    : "0 results"}
                </span>

                <button
                  onClick={goToPrevious}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ↑
                </button>

                <button
                  onClick={goToNext}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ↓
                </button>
              </>
            )}
          </div>
<button
  onClick={handleExport}
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  Export to Excel
</button>


        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6">
          Attendance for: {eventTitle}
        </h1>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-500">Loading attendance...</p>
        ) : attendance.length === 0 ? (
          <p className="text-gray-500">No attendance records yet</p>
        ) : filteredAttendance.length === 0 ? (
          <p className="text-gray-500">No matching records found</p>
        ) : (
          <div className="bg-white shadow rounded p-6 overflow-x-auto">
            <table className="w-full border-2 border-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border-2 border-black text-left">Name</th>
                  <th className="p-2 border-2 border-black text-left">Email</th>
                  <th className="p-2 border-2 border-black text-left">Role</th>
                  <th className="p-2 border-2 border-black text-left">Location</th>
                  <th className="p-2 border-2 border-black text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record._id}>
                    <td className="p-2 border-2 border-black">
                      {highlightText(record.userId?.name || "")}
                    </td>
                    <td className="p-2 border-2 border-black">
                      {highlightText(record.userId?.email || "")}
                    </td>
                    <td className="p-2 border-2 border-black capitalize">
                      {record.userId?.role}
                    </td>
                    <td className="p-2 border-2 border-black">
                      {record.address}
                    </td>
                    <td className="p-2 border-2 border-black">
                      {new Date(record.timestamp).toLocaleString()}
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
