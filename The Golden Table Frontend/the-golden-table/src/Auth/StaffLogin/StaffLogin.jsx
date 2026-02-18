import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "../../Context/StaffAuthContext/StaffAuthContext";
import StaffAxios from "../../API/StaffAxios/StaffAxios";
import "./StaffLogin.css"
import logo from "../../assets/Images/logo.png"

function StaffLogin() {
  const navigate = useNavigate();
  const { staffAuth } = useStaffAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    staff_phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "staff_phone_number") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await StaffAxios.post("login/", formData);

      // ✅ Store JWT tokens
      localStorage.setItem("staff_access", res.data.access);
      localStorage.setItem("staff_refresh", res.data.refresh);

      // ✅ Verify auth using profile API
      await staffAuth();

      // ✅ Redirect to dashboard
      navigate("/staff/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Invalid staff credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-login-main">

      <div><img className="rest-logo" src={logo} alt="logo" /></div>
      <h2>Staff Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="staff_phone_number"
          placeholder="Phone Number"
          value={formData.staff_phone_number}
          onChange={handleChange}
          required
          autoComplete="tel"
          inputMode="numeric"
          className="form-control input"
        />

        <br />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          className="form-control input"
        />

        <label className="toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(prev => !prev)}
            className="form-control"
          />
          <span className="slider"></span>
          <span className="text">Show Password</span>
        </label>

        <br />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default StaffLogin;
