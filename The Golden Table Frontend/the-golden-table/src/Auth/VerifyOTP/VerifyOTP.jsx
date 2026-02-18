import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerAxios from "../../API/CustomerAxios/CustomerAxios";
import logo from "../../assets/Images/logo.png"
import "./VerifyOTP.css"

function VerifyOTP() { 
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const customer_phone = location.state?.customer_phone; 
  const [otp, setOtp] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  
  useEffect(() => { 
    if (!customer_phone) { 
      navigate("/login"); 
      return; 
    } }, [customer_phone, navigate]); 
    
    const resendOTP = async () => { 
      setError(""); 
      setMessage(""); 
      setLoading(true); 
      try { 
        await CustomerAxios.post("resend-otp/", 
          { customer_phone, }
        ); 
        setMessage("OTP sent to your email"); 
      } catch (err) { 
          setError( err.response?.data?.non_field_errors?.[0] || "Unable to resend OTP" ); 
      } finally { 
          setLoading(false); 
      } 
    }; 

      const verifyOTP = async () => { 
        setError(""); 
        try { 
          await CustomerAxios.post("verify-otp/", 
            { customer_phone, otp, }); 
            navigate("/login"); 
          } catch (err) { 
            setError( err.response?.data?.non_field_errors?.[0] || "Invalid or expired OTP" ); 
          } 
        };

  return (
    <>
      <div className="verify-main">  
        <div><img className="login-logo" src={logo} alt="logo" /></div> 
        <h2>Verify OTP</h2>
        {message && <p style={{ color: "#C9A227" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control" />
        <br />
        <button className="btn-primary" onClick={verifyOTP}>Verify OTP</button>
        <br />
        <button className="btn-primary" onClick={resendOTP} disabled={loading}>
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </>
  );
}

export default VerifyOTP;