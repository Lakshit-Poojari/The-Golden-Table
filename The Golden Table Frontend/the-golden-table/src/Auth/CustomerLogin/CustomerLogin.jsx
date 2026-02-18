import React, { useState } from "react";
import CustomerAxios from "../../API/CustomerAxios/CustomerAxios";
import { useCustomerAuth } from "../../Context/CustomerAuthContext/CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import "./CustomerLogin.css"
import logo from "../../assets/Images/logo.png"

function CustomerLogin() {
  const [showPassword, setshowPassword] = useState(false)
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_phone: "",
    customer_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customer_phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await CustomerAxios.post("login/", formData);
      login(response.data.tokens.access);
    } catch (err) {
      const errorMsg =
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid credentials";

      if (errorMsg === "Phone number not verified") {
        navigate("/verify-otp", {
          state: { customer_phone: formData.customer_phone },
        });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main-login">
        <img className="rest-logo" src={logo} alt="logo" />
        <h2>Customer Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Phone Number"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            required
            className="input form-control"
          />

<br />
          <input
            type={showPassword? "text" : "password"}
            placeholder="Password"
            name="customer_password"
            value={formData.customer_password}
            onChange={handleChange}
            required
            className="form-control input"
          />

          <label className="toggle">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setshowPassword(prev => !prev)}
            />
            <span className="slider"></span>
            <span className="text">Show Password</span>
          </label>


          <br />

          <p style={{ textAlign: "left", cursor: "pointer", color: "#C9A227" }}
            onClick={() =>
              navigate("/forgot-password", {
                state: { customer_phone: formData.customer_phone },
              })
            }> Forgot password? </p>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CustomerLogin;

