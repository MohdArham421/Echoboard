import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ fixed key
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="kode-mono-fontStyle bg-cyan-900 text-white px-6 py-4">
      
      <div className="flex justify-between items-center">
        
        {/* 🔥 CLICKABLE LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          EchoBoard
        </div>

        {/* 🔥 DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/echowall" className="hover:text-gray-300">EchoWall</Link>
          <Link to="/echochat" className="hover:text-gray-300">EchoChat</Link>
          <Link to="/echoai" className="hover:text-gray-300">EchoAI</Link>
          <Link to="/manageprofile" className="hover:text-gray-300">Profile</Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {/* 🔥 MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 🔥 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3 bg-cyan-800 p-4 rounded-lg">
          <Link to="/echowall" onClick={() => setMenuOpen(false)}>EchoWall</Link>
          <Link to="/echochat" onClick={() => setMenuOpen(false)}>EchoChat</Link>
          <Link to="/echoai" onClick={() => setMenuOpen(false)}>EchoAI</Link>
          <Link to="/manageprofile" onClick={() => setMenuOpen(false)}>Profile</Link>

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;