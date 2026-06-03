import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/"); // redirect after successful login
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kode-mono-fontStyle flex min-h-screen justify-center items-center">
      <div className="sm:w-full sm:max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 rounded-2xl shadow-lg bg-white border border-gray-200"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-sky-600">
              Log in to your account
            </h2>
            <p className="text-gray-700 mt-1">
              Welcome back! Please login to continue.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-cyan-900">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-cyan-900">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg bg-cyan-900 hover:bg-cyan-800 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-sky-600 hover:text-cyan-900"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;