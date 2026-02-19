import axios from "axios";

const CustomerAxios = axios.create({
  baseURL: "https://the-golden-table.onrender.com/customer/",
  // baseURL: "http://127.0.0.1:8000/customer/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT automatically
CustomerAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Auto logout on token expiry / invalid token
CustomerAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === "token_not_valid"
    ) {
      // 🧹 Clear auth storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Optional: clear user info
      localStorage.removeItem("customer");

      // 🚪 Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default CustomerAxios;
