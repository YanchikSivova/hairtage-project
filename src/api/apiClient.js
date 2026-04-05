import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3000/hairtage",
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.headers?.["Content-Type"] === "application/x-www-form-urlencoded") {
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof URLSearchParams)
    ) {
      const params = new URLSearchParams();
      Object.entries(config.data).forEach(([key, value]) => {
        params.append(key, value);
      });
      config.data = params;
    }
  }

  return config;
});
