import React from 'react'
import "./ForgotPassword.css"
import axios from 'axios';
import CustomerAxios from '../../API/CustomerAxios/CustomerAxios';
import { useState } from 'react';

function ForgotPassword() {
  const [step, setStep] = useState("SEND"); // SEND → VERIFY → RESET
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setshowPassword] = useState(false)

  const sendOtp = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await CustomerAxios.post(
      "forgot-password/",
      { customer_phone: phone }
    );

    setMessage(res.data.message || "OTP sent");
    setStep("VERIFY");
  } catch (err) {
    setError(err.response?.data?.error || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


  const verifyOtp = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await CustomerAxios.post(
      "verify-reset-otp/",
      {
        customer_phone: phone,
        otp: otp,
      }
    );

    setMessage(res.data.message || "OTP verified");
    setStep("RESET");
  } catch (err) {
    setError(err.response?.data?.error || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};


  const resetPassword = async () => {
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await CustomerAxios.post(
      "reset-password/",
      {
        customer_phone: phone,
        new_password: password,
      }
    );

    setMessage(res.data.message || "Password reset successful");
    setStep("DONE");
  } catch (err) {
    setError(err.response?.data?.error || "Reset failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className='main-forgot'>
      <div className='forgot-container'>
        <h3>Forgot Password</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        {step === "SEND" && (
          <>
            <input
              placeholder="Registered phone number"
              value={phone}
              className='form-control'
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className='form-control' onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "VERIFY" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              className='form-control'
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className='form-control' onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === "RESET" && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              className='form-control'
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              className='form-control'
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button className='form-control' onClick={resetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {step === "DONE" && <p>Password reset successfully 🎉</p>}
      </div>
    </div>
  );
}

export default ForgotPassword