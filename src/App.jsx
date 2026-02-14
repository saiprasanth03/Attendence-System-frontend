import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import ScanQR from "./pages/ScanQR";
import MemberDashboard from "./pages/MemberDashboard";
import EventAttendance from "./pages/EventAttendance";
import EventQR from "./pages/EventQR";
import PRDashboard from "./pages/PRDashboard";
import EditEventLocation from "./pages/EditEventLocation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pr" element={<PRDashboard />} />
      <Route path="/event-qr/:id" element={<EventQR />} />
      <Route path="/member" element={<MemberDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-event/:id?" element={<CreateEvent />} />
      <Route path="/edit-location/:id" element={<EditEventLocation />} />
      <Route path="/scan" element={<ScanQR />} />
      <Route path="/event-attendance/:eventId" element={<EventAttendance />} />
    </Routes>
  );
}
