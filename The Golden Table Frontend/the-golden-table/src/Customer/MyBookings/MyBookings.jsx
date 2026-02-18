import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAxios from "../../API/CustomerAxios/CustomerAxios";
import { useCustomerAuth } from "../../Context/CustomerAuthContext/CustomerAuthContext";
import "./MyBookings.css"

function MyBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await CustomerAxios.get(
          "bookings/my_bookings/"
        );
        const data = response.data.bookings;

        if (Array.isArray(data)) {
          setBookings(data);
        } else if (Array.isArray(data.results)) {
          setBookings(data.results);
        } else {
          setBookings([]);}
        
      } catch (err) {
        setError("Failed to load bookings");
        console.log("Booking error:", err.response?.data);
    setError(JSON.stringify(err.response?.data));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, bookings]);

  if (!isAuthenticated) {
    return (
      <div>
        <h2>My Bookings</h2>
        <p>Please login to view your bookings.</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (bookings.length === 0) {
    return <div className="no-booking"><h2>No bookings found.</h2></div>
    ;
  }

  const handleCancel = async (bookingId) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) {
    return;
  }

  try {
    await CustomerAxios.post(
      `bookings/${bookingId}/cancel/`
    );

    // Remove or update booking in UI
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "CANCELLED" }
          : b
      )
    );
  } catch (err) {
    alert(
      err.response?.data?.detail ||
      "Failed to cancel booking"
    );   
  
  }
};

  return (

    <div className="mybooking-main">
      <h2>My Bookings</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td data-label="Date">{booking.booking_date}</td>
              <td data-label="Time Slot">{booking.time_slot}</td>
              <td data-label="Guests">{booking.number_of_guests}</td>
              <td data-label="Status">{booking.status}</td>
              <td data-label="Action">
                {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
                  <button onClick={() => handleCancel(booking.id)}>Cancel</button>
                ) : (
                  <span>-</span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;
