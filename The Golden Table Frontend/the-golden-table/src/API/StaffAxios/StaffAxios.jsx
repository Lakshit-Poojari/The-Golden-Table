import axios from "axios";

const StaffAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/staff/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT automatically
StaffAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("staff_access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Auto logout on token expiry / invalid token
StaffAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && code === "token_not_valid") {
      console.warn("Staff session expired");

      // 🧹 Clear tokens
      localStorage.removeItem("staff_access");
      localStorage.removeItem("staff_refresh");

      // 🚪 Redirect to staff login
      window.location.href = "/staff/login";
    }

    return Promise.reject(error);
  }
);

export default StaffAxios;
