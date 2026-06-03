import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", res.data.token);

      alert("Signup successful 🚀");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="kode-mono-fontStyle flex min-h-screen justify-center items-center px-4">
      
      <div className="w-full max-w-lg"> {/* 🔥 balanced width */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8 rounded-2xl shadow-lg"
          style={{ backgroundColor: "white", border: "2px solid #e0e0e0" }}
        >

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-sky-600">
              Create your account
            </h2>
            <p className="text-gray-600 mt-1">
              Join EchoBoard and start echoing your thoughts.
            </p>
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-sm font-medium text-cyan-900">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              placeholder="Choose username"
              onChange={handleChange}
              className="mt-1 w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-cyan-900">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter email"
              onChange={handleChange}
              className="mt-1 w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* 🔥 PASSWORD ROW (ONLY THIS IN GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-cyan-900">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create password"
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium text-cyan-900">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Confirm password"
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

          </div>

          {/* 🔥 IMPROVED BUTTON */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-2 text-white font-semibold rounded-full bg-cyan-900 hover:bg-cyan-800 transition"
            >
              Sign Up
            </button>
          </div>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-sky-600 hover:text-cyan-900"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;