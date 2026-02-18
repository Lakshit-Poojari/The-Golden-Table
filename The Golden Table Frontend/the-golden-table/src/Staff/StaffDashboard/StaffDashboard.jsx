import React from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "../../Context/StaffAuthContext/StaffAuthContext";
import "./StaffDashboard.css"

function StaffDashboard() {
  const navigate = useNavigate();
  const { logout, staff } = useStaffAuth(); // 👈 get staff info

  const isManager = staff?.role === "manager";
  console.log("STAFF CONTEXT:", staff);


  return (
    <div className="staff-dashboard">

      <div className="staff-header">
        <h1>Staff Dashboard</h1>
        
      </div>

      <div className="staff-welcome">
        <h2>Welcome {staff.full_name} 👋</h2>
        <p>
          Use the dashboard to manage bookings and perform customer check-ins.
        </p>
      </div>

      {isManager && (
        <div className="manager-note">
          <h3>Manager Access</h3>
          <p>
            You have access to administrative features including menu management.
          </p>
        </div>
      )}

    <div className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="action-buttons">
        <button onClick={() => navigate("/staff/bookings")}>
          View All Bookings
        </button>

        <button onClick={() => navigate("/staff/StaffBookings")}>
          Check In Guests
        </button>

        {isManager && (
          <button onClick={() => navigate("/staff/menu")}>
            Manage Menu
          </button>
        )}
      </div>

      <p className="quick-help">
        Select an action above based on your role and responsibilities.
      </p>
    </div>

    <button className="btn" onClick={logout}>Logout</button>
  </div>

  );
}

export default StaffDashboard;
