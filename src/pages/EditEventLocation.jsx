import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PolygonMap from "../components/PolygonMap";

export default function EditEventLocation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [allowedRegion, setAllowedRegion] = useState([]);

  // =========================================
  // FETCH EVENT
  // =========================================
  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);

      // ✅ DO NOT CONVERT
      // Backend already stores [lng, lat]
      setAllowedRegion(res.data.allowedRegion || []);

    } catch (err) {
      console.error(err);
      alert("Error fetching event");
    }
  };

  // =========================================
  // UPDATE LOCATION
  // =========================================
  const updateLocation = async () => {
    try {
      if (!allowedRegion || allowedRegion.length === 0) {
        alert("Please draw a region on map");
        return;
      }

      // ✅ DO NOT FLIP
      await api.put(`/events/update-location/${id}`, {
        allowedRegion,
      });

      alert("Location updated successfully");
      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // =========================================
  // UI
  // =========================================
  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Edit Location - {event.title}
        </h1>

        <div className="bg-white shadow rounded p-4 mb-6">
          <PolygonMap
            setPolygon={setAllowedRegion}
            existingPolygon={allowedRegion}
          />
        </div>

        <button
          onClick={updateLocation}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Location
        </button>

      </div>
    </div>
  );
}
