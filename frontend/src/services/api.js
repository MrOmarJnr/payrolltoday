import axios from "axios";

// API base is configurable at build time so the same code works in dev and
// behind a reverse proxy in production. Set VITE_API_URL=/api for the Docker
// build (nginx proxies /api to the backend); defaults to localhost for dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lefpayroll_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// If the session has expired (or the token is invalid), clear it and send the
// user back to the login screen instead of surfacing a raw 401 error.
let redirecting = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || "";
    const isAuth = status === 401 || /token|expired|authentication/i.test(msg);
    if (isAuth && !redirecting) {
      redirecting = true;
      localStorage.removeItem("lefpayroll_token");
      localStorage.removeItem("lefpayroll_user");
      // Give any in-flight toast a moment, then reload to the login page.
      setTimeout(() => window.location.reload(), 400);
    }
    return Promise.reject(error);
  }
);

export default api;