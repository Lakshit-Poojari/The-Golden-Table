import axios from 'axios';
import React from 'react'
import { CustomerAuthProvider, useCustomerAuth } from '../../Context/CustomerAuthContext/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CustomerAxios from '../../API/CustomerAxios/CustomerAxios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./BookTable.css"
import logo from "../../assets/Images/logo.png"

function BookTable() {
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  const Today = new Date();
  const Tomorrow = new Date();
  Tomorrow.setDate(Today.getDate() + 1);

  const one_week = new Date();
  one_week.setDate(Today.getDate() + 7);

  const [formData, setFormData] = useState({
    booking_date: null,
    time_slot: "",
    number_of_guests: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!isAuthenticated) {
    navigate("/login", {
      state: { message: "Please login to book a table" },
    });
    return;
  }

  if (!formData.booking_date) {
    setError("Please select a booking date");
    return;
  }

  // 🔥 FIX: convert Date → YYYY-MM-DD
  const payload = {
    booking_date: formatDate(formData.booking_date),
    time_slot: formData.time_slot,
    number_of_guests: Number(formData.number_of_guests),
  };

  try {
    await CustomerAxios.post("bookings/create/", payload);
    setSuccess("Booking done successfully");
    navigate("/customer/my-booking");
  } catch (err) {

     const data = err.response?.data;

    setError(
      data?.detail ||
      data?.non_field_errors?.[0] ||
      data?.booking_date?.[0] ||
      data?.time_slot?.[0] ||
      "Failed to book table"
    );

    console.log("Booking error:", err.response?.data);
    // setError(JSON.stringify(err.response?.data));
  }
};

  return (
    <>
      <div className='book-table-main'>

        <img className="login-logo" src={logo} alt="logo" />
        <h3>Book a Table</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Booking Date</label>

          <DatePicker
            selected={formData.booking_date}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, booking_date: date }))}
            dateFormat="yyyy-MM-dd"
            minDate={Tomorrow}
            maxDate={one_week}
            placeholderText="Select a date"
            className='form-control input'/>
      

          <label>Booking Time</label>

          <select
            name="time_slot" className='form-control input'
            value={formData.time_slot}
            onChange={handleChange}
            required>
            <option value="">Select Time Slot</option>
            <option value="12:00-13:30">12:00 PM - 01:30 PM</option>
            <option value="13:30-15:00">01:30 PM - 03:00 PM</option>
            <option value="18:30-20:00">06:30 PM - 08:00 PM</option>
            <option value="20:00-21:30">08:00 PM - 09:30 PM</option>
            <option value="21:30-23:00">09:30 PM - 11:00 PM</option>
          </select>


              <label>Number of guest</label>

          <input
            type="number"
            name="number_of_guests"
            min="1" className='form-control input'
            value={formData.number_of_guests}
            onChange={handleChange}
            required/>
          <br />

          <button type="submit" className='btn-primary form-control'>Book Table</button>
        </form>
      </div>
    </>
  );
}
export default BookTable;