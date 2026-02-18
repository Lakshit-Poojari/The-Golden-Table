import React, { useState } from "react";
import StaffAxios from "../../API/StaffAxios/StaffAxios";
import "./CheckInVerification.css";

function CheckInVerification({ bookingId, onSuccess }) {
  // const DEV_MODE = true; //  set false in production

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("SEND");
  const [loading, setLoading] = useState(false);

  /* SEND OTP  */
  const sendOtp = async () => {
    setError("");
    setMessage("");

    // if (DEV_MODE) {
    //   setMessage("OTP sent successfully (DEV MODE)");
    //   setStep("VERIFY");
    //   return;
    // }

    try {
      setLoading(true);
      await StaffAxios.post(`/booking/${bookingId}/send-otp/`);
      setMessage("OTP sent successfully");
      setStep("VERIFY");
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /*  VERIFY OTP  */
  const verifyOtp = async (tableAvailable) => {
    setError("");

    // if (DEV_MODE) {
    //   // simulate success in dev
    //   onSuccess();
    //   return;
    // }

    try {
      setLoading(true);

      await StaffAxios.post(
        `/booking/${bookingId}/verify-arrival/`,
        {
          otp,
          table_available: tableAvailable,
        }
      );

      onSuccess(); // refresh booking list
    } catch {
      setError("Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  /* UI  */
  return (
    <div className="checkin-main">
      <h3>Check-In Verification</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {step === "SEND" && (
        <button onClick={sendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      )}

      {step === "VERIFY" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            maxLength={6}  />

          <p><strong>Table Available?</strong></p>

          <button onClick={() => verifyOtp(true)}
            disabled={loading} >
            {loading ? "Processing..." : "Verify & Check-In"}
          </button>

          <button onClick={() => verifyOtp(false)}
            disabled={loading}
            style={{ marginTop: "10px" }} >
            {loading ? "Processing..." : "Verify & Mark Waiting"}
          </button>
        </>
      )}
    </div>
  );
}

export default CheckInVerification;
