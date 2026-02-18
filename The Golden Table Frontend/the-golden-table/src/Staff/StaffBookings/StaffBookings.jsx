import React, { useEffect, useState } from "react";
import StaffAxios from "../../API/StaffAxios/StaffAxios";
import CheckInVerification from "../../Auth/CheckInVerification/CheckInVerification";
import { useNavigate } from "react-router-dom";
import "./StaffBookings.css"

function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings(); // initial load → all bookings
  }, []);

  const fetchBookings = async (searchPhone = "") => {
    try {
      setLoading(true);

      const url = searchPhone
        ? `booking/list/?phone=${searchPhone}`
        : "booking/list/";

      const res = await StaffAxios.get(url);
      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (phone.length !== 10) {
      setError("Enter valid 10-digit phone number");
      return;
    }
    fetchBookings(phone);
  };

  const handleClear = () => {
    setPhone("");
    setError("");
    fetchBookings(); // back to default list
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="staffbooking-main">
      <h2>Check-In Verification</h2>

      <button className='form-control'  onClick={() => navigate("/staff/dashboard")}>
            ← Back to Dashboard
          </button>

      {/* 🔍 Search + Clear */}
      <div className="staffbooking-input">
        <input
          type="text"
          placeholder="Customer phone number"
          value={phone}
          className='form-control'
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
          maxLength={10}/>

        <button className='form-control' onClick={handleSearch} >Search</button>

        <button className='form-control' onClick={handleClear}>Clear</button>
      </div>

      {bookings.length === 0 && <p>Today there is No bookings</p>}

      {bookings.map((booking) => (
        <div key={booking.id}>
          <p><strong>Name:</strong> {booking.customer_full_name}</p>
          <p><strong>Phone:</strong> {booking.customer_phone}</p>
          <p><strong>Date:</strong> {booking.booking_date}</p>
          <p><strong>Time:</strong> {booking.time_slot}</p>
          <p><strong>Guests:</strong> {booking.number_of_guests}</p>
          <p><strong>Status:</strong> {booking.status}</p>

          {booking.status === "CONFIRMED" && (
            <CheckInVerification bookingId={booking.id} onSuccess={() => fetchBookings()}/>
          )}

          {booking.status === "CHECKED_IN" && (
            <p >✔ Checked In </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default StaffBookings;
