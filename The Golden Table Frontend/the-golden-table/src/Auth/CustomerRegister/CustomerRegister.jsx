import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomerAxios from '../../API/CustomerAxios/CustomerAxios';
import "./CustomerRegister.css"
import logo from "../../assets/Images/logo.png"

function CustomerRegister() {
  const [showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // restrict phone to digits only (max 10)
    if (name === "customer_phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ submit register
  const submitChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔑 backend payload
    const payload = {
      customer_full_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email || null, // 👈 email optional
      customer_password : formData.customer_password,
    };

    try {
      await CustomerAxios.post("register/", payload);

      setSuccess("OTP sent successfully");

      // 👉 redirect to OTP verification
      navigate("/verify-otp", {
        state: {
          phone: formData.customer_phone,
          email: formData.customer_email || null,
        },
      });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Registration failed"
      );
  //     console.log("Register error response:", err.response?.data);

  // setError(
  //   JSON.stringify(err.response?.data) || "Registration failed"
  // );
    }
  };

  return (
    <div className='register-main'>
      <div><img className="rest-logo" src={logo} alt="logo" /></div>
      <h2>Customer Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={submitChange}>
        <input
          type="text"
          name="customer_name"
          placeholder="Full Name"
          value={formData.customer_name}
          onChange={handleChange}
          required
          className='form-control input'
        />

        <br />

        <input
          type="email"
          name="customer_email"
          placeholder="Email"
          autoComplete="email"
          value={formData.customer_email}
          onChange={handleChange}
          className='form-control input'
          required
        />

        <br />

        <input
          type="tel"
          name="customer_phone"
          placeholder="Phone Number"
          autoComplete="tel"
          inputMode="numeric"
          value={formData.customer_phone}
          onChange={handleChange}
          required
          className='form-control input'
        />

        <br />

        <input
          type={showPassword? "text" : "password"}
          name="customer_password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.customer_password}
          onChange={handleChange}
          required
          className='form-control input'
        />

        <label className="toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setshowPassword(prev => !prev)}
            className='form-control'
          />
          <span className="slider"></span>
          <span className="text">Show Password</span>
        </label>

        <br />

        <button className="btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
}

export default CustomerRegister