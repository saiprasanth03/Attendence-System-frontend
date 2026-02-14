import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import QRCode from "react-qr-code";

export default function EventQR() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(50);

  // =========================
  // FETCH EVENT
  // =========================
  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // QR ROTATION + COUNTDOWN
  // =========================
  useEffect(() => {
    if (!event) return;

    const updateQR = () => {
      const now = Date.now();

      const timeWindow = Math.floor(now / 50000);

      // Calculate remaining seconds in current 50 sec window
      const remaining =
        50 - Math.floor((now % 50000) / 1000);

      setQrValue(`${event._id}-${timeWindow}`);
      setSecondsLeft(remaining);
    };

    updateQR(); // run immediately

    const interval = setInterval(updateQR, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20">

      <h1 className="text-3xl font-bold mb-6">
        {event.title}
      </h1>

      <div className="bg-white p-6 shadow-xl rounded-lg">
        <QRCode value={qrValue} size={300} />
      </div>

      {/* 🔥 COUNTDOWN BELOW QR */}
      <p className="mt-4 text-gray-600 text-lg">
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
  );
}
