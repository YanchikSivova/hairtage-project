import { api } from "./apiClient";

export const authApi = {
  login: (email, password) =>
    api
      .post(
        "/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => res.data),

  logout: () => api.post("/logout").then((res) => res.data),

  getMe: () => api.get("/person/accountInfo").then((res) => res.data),

  checkAuth: () => api.get("/person/checkAuth").then((res) => res.data),

  isAdmin: () => api.get("/person/isAdmin").then((res) => res.data),
};

export const adminApi = {
  getProducts: () => api.get("/admin").then((res) => res.data),

  createProduct: (data) =>
    api.post("/admin/create", data).then((res) => res.data),

  updateProduct: (productId, data) =>
    api.patch(`/admin/update/${productId}`, data).then((res) => res.data),

  deleteProduct: (productId) =>
    api.delete(`/admin/delete/${productId}`).then((res) => res.data),

  addRole: (email) =>
    api.patch(`/admin/addRole/${encodeURIComponent(email)}`).then((res) => res.data),

  addProducts: (products) =>
    api.post("/product/addProducts", products).then((res) => res.data),
};