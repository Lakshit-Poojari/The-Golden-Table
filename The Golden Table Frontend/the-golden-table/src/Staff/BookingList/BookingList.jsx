import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffAxios from "../../API/StaffAxios/StaffAxios";
import "./BookingList.css";

function BookingList() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- NAVIGATION -------------------- */
  const openCheckIn = (bookingId) => {
    navigate("/staff/StaffBookings", {
      state: { bookingId },
    });
  };

  /* -------------------- FETCH BOOKINGS -------------------- */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await StaffAxios.get("/booking/list/");
      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* -------------------- SEARCH -------------------- */
  const searchByPhone = async () => {
    if (searchPhone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await StaffAxios.get(
        `/booking/list/?phone=${searchPhone}`
      );
      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setBookings([]);
      setError("No booking found for this phone number");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- ACTION APIs -------------------- */
  const confirmBooking = async (id) => {
    try {
      await StaffAxios.post(`/booking/${id}/confirm/`);
      fetchBookings();
    } catch {
      alert("Unable to confirm booking");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await StaffAxios.post(`/booking/${id}/cancel/`);
      fetchBookings();
    } catch {
      alert("Unable to cancel booking");
    }
  };

  const assignTable = async (id) => {
    try {
      await StaffAxios.post(`/booking/${id}/assign-table/`);
      fetchBookings();
    } catch {
      alert("Unable to assign table");
    }
  };

  const completeBooking = async (id) => {
    if (!window.confirm("Mark booking as completed?")) return;

    try {
      await StaffAxios.post(`/booking/${id}/complete/`);
      fetchBookings();
    } catch {
      alert("Unable to complete booking");
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="bookinglist-main">
      {/* Header */}
      <div>
        <h1>Booking List</h1>
        <button onClick={() => navigate("/staff/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by phone number"
          value={searchPhone}
          onChange={(e) =>
            setSearchPhone(e.target.value.replace(/\D/g, ""))
          }
          maxLength={10}
        />
        <button onClick={searchByPhone}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7">No bookings found</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer_full_name}</td>
                <td>{booking.customer_phone}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.time_slot}</td>

                {/* STATUS */}
                <td>
                  {booking.status === "WAITING"
                    ? "Waiting for Table"
                    : booking.status.replace("_", " ")}
                </td>

                {/* ACTIONS */}
                <td>
                  {booking.status === "PENDING" && (
                    <>
                      <button onClick={() => confirmBooking(booking.id)}>
                        Confirm
                      </button>
                      <button onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === "CONFIRMED" && (
                    <button onClick={() => openCheckIn(booking.id)}>
                      Check-In
                    </button>
                  )}

                  {booking.status === "WAITING" && (
                    <button onClick={() => assignTable(booking.id)}>
                      Assign Table
                    </button>
                  )}

                  {booking.status === "CHECKED_IN" && (
                    <button onClick={() => completeBooking(booking.id)}>
                      Complete
                    </button>
                  )}

                  {booking.status === "COMPLETED" && (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      ✅ Completed
                    </span>
                  )}

                  {booking.status === "CANCELLED" && (
                    <span style={{ color: "red", fontWeight: 600 }}>
                      ❌ Cancelled
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingList;
