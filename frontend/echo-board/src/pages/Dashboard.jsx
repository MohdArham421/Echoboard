import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { getProfile } from "../api/profile.api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [profile, setProfile] = useState(null);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await getProfile();

      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProfile();
}, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white kode-mono-fontStyle">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <h1 className="text-3xl font-bold mb-2">
  Welcome back, {profile?.name || user?.username || "User"} 👋
</h1>

<p className="text-cyan-400 mb-4">
  {profile?.professions?.join(" • ")}
</p>

        <p className="text-gray-400 mb-10">
          Manage your activity, explore new features, and stay connected.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* EchoWall */}
          <Link to="/echowall">
            <div className="p-6 bg-white/5 hover:bg-white/10 transition rounded-xl shadow-lg backdrop-blur-md border border-white/10 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">EchoWall</h2>
              <p className="text-gray-300 text-sm">
                Post anything and explore your feed.
              </p>
            </div>
          </Link>

          {/* EchoChat */}
          <Link to="/echochat">
            <div className="p-6 bg-white/5 hover:bg-white/10 transition rounded-xl shadow-lg backdrop-blur-md border border-white/10 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">EchoChat</h2>
              <p className="text-gray-300 text-sm">
                Chat with friends in real-time.
              </p>
            </div>
          </Link>

          {/* EchoAI */}
          <Link to="/echoai">
            <div className="p-6 bg-white/5 hover:bg-white/10 transition rounded-xl shadow-lg backdrop-blur-md border border-white/10 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">EchoAI</h2>
              <p className="text-gray-300 text-sm">
                Generate blogs, captions, ideas using AI.
              </p>
            </div>
          </Link>

          {/* Manage Profile */}
          <Link to="/manageprofile">
            <div className="p-6 bg-white/5 hover:bg-white/10 transition rounded-xl shadow-lg backdrop-blur-md border border-white/10 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Manage Profile</h2>
              <p className="text-gray-300 text-sm">
                Update your account details & profile photo.
              </p>
            </div>
          </Link>

        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Activity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-gray-300">Posts</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
            </div>

            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-gray-300">Chats</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
            </div>

            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-gray-300">AI Requests</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
