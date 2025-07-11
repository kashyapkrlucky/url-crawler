// src/lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const excludedEndpoints = ["/login", "/register", "/guest-login"];
  const isExcluded = excludedEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (!isExcluded) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
