



import React, { useState, useEffect } from "react";
import api from "../services/api";
import QRCode from "react-qr-code";
import { useParams, useNavigate } from "react-router-dom";
import PolygonMap from "../components/PolygonMap";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [secondsLeft, setSecondsLeft] = useState(50);
  const [allowedRegion, setAllowedRegion] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("offline");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [event, setEvent] = useState(null);
  const [qrValue, setQrValue] = useState("");

  // ===============================
  // FETCH EVENT (QR DISPLAY MODE)
  // ===============================
  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // CREATE EVENT
  // ===============================
  const createEvent = async () => {
    try {
      if (!title || !date) {
        alert("Title and Date are required");
        return;
      }

      if (type === "offline") {
        if (!location) {
          alert("Location is required for offline event");
          return;
        }

        if (allowedRegion.length === 0) {
          alert("Please select allowed region on map");
          return;
        }
      }

      // ✅ IMPORTANT:
      // PolygonMap already sends [lng, lat]
      // DO NOT flip again
      const formattedRegion =
        type === "offline" ? allowedRegion : [];

      const res = await api.post("/events/create", {
        title,
        type,
        date,
        location: type === "offline" ? location : "",
        meetingLink: type === "online" ? meetingLink : "",
        allowedRegion: formattedRegion,
      });

      navigate(`/event-qr/${res.data._id}`);

    } catch (err) {
      console.log(err.response?.data);
      alert("Event creation failed");
    }
  };

  // ===============================
  // 50 SECOND QR ROTATION
  // ===============================
  useEffect(() => {
    if (!event) return;

    const updateQR = () => {
      const now = Date.now();

      const timeWindow = Math.floor(now / 50000);

      const remaining =
        50 - Math.floor((now % 50000) / 1000);

      setQrValue(`${event._id}-${timeWindow}`);
      setSecondsLeft(remaining);
    };

    updateQR();

    const interval = setInterval(updateQR, 1000);

    return () => clearInterval(interval);
  }, [event]);


  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Event QR" : "Create Event"}
      </h1>

      {/* ================= CREATE MODE ================= */}
      {!id && (
        <div className="space-y-4 max-w-md">

          <input
            placeholder="Event Title"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="border p-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>

          {type === "offline" && (
            <>
              <input
                placeholder="Location"
                className="border p-2 w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <h3 className="font-semibold mt-4">
                Select Allowed Region on Map
              </h3>

              <PolygonMap setPolygon={setAllowedRegion} />
            </>
          )}

          {type === "online" && (
            <input
              placeholder="Meeting Link"
              className="border p-2 w-full"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          )}

          <button
            onClick={createEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Create Event
          </button>
        </div>
      )}

      {/* ================= QR DISPLAY MODE ================= */}
      {event && (
        <div className="mt-6 flex flex-col items-center">
          <h2 className="mb-4 font-semibold text-xl">
            Event QR Code (Changes Every 50 Seconds)
          </h2>

          <div className="bg-white p-6 shadow-xl rounded-lg">
            <QRCode value={qrValue} size={300} />
          </div>

          <p className="text-[20px] text-gray-600 mt-4">
            QR refreshes in{" "}
            <span
              className={`font-bold ${
                secondsLeft <= 10
                  ? "text-red-500"
                  : "text-blue-600"
              }`}
            >
              {secondsLeft}s
            </span>
          </p>

        </div>
      )}
    </div>
  );
}
