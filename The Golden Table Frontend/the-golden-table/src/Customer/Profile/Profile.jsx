import React, { useEffect, useState } from 'react'
import CustomerAxios from '../../API/CustomerAxios/CustomerAxios'
import { useCustomerAuth } from '../../Context/CustomerAuthContext/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import "./Profile.css"

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await CustomerAxios.get("customer_profile/");
        console.log("Profile response:", response.data);

        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Profile error:", error.response?.data);
        setError("Failed to load your profile, please try to login");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className='logout'>
      <div className="profile-guest">
        <h2>My Profile</h2>
        <p>Please login to view your profile.</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
      </div>

    );
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <h1 style={{ color: "red", textAlign: "center"}}>{error}</h1>;
  }

  return (
    <div className='main-profile'>
      <div className="profile-card">
        <h2>My Profile</h2>
        <p><strong>Name:</strong> {profile.customer_name}</p>
        <p><strong>Phone:</strong> {profile.customer_phone}</p>
        <p><strong>Email:</strong> {profile.customer_email || "Not provided"}</p>
        <p>
          <strong>Phone Verified:</strong>{" "}
          {profile.is_phone_verified ? "✅ Verified" : "❌ Not Verified"}
        </p>
      </div>
    </div>
  );
}

export default Profile