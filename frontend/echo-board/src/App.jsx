import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageProfile from "./pages/ManageProfile";
import EchoChat from "./pages/EchoChat";
import EchoAI from "./pages/EchoAI";
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import EchoWall from "./pages/EchoWall";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
           </ProtectedRoute>
          }
        />
        <Route path="/manageprofile" element={<ManageProfile />} />
        <Route path="/echochat" element={<EchoChat />} />
        <Route path="/echowall" element={<EchoWall />} />
        <Route path="/echoai" element={<EchoAI />} />
        {/* <Route path="*" element={<Navigate to="/signup" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
