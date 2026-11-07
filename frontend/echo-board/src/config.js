// Centralized configuration for API and Socket URLs
const rawUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// Ensure no trailing slash and strip /api if the user provided it in VITE_BACKEND_URL
export const BACKEND_URL = rawUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

export const API_URL = `${BACKEND_URL}/api`;

