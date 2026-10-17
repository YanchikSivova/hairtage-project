import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3000/hairtage",
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const { data: csrf } = await api.get("/csrf");
    config.headers[csrf.headerName] = csrf.token;
  }

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
