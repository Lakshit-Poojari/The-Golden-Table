import axios from "axios";

const MenuAxios = axios.create({
  baseURL: "https://the-golden-table.onrender.com/menu/",
  // baseURL: "http://127.0.0.1:8000/menu/",
});

/* Attach token automatically */
MenuAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("staff_access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❗ DO NOT set Content-Type here
    // Axios will set it automatically (JSON / multipart)

    return config;
  },
  (error) => Promise.reject(error)
);

export default MenuAxios;
