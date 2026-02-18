import React from 'react'
import "./Home.css"
import { useCustomerAuth } from '../../Context/CustomerAuthContext/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/Images/logo.png"
import ChatBot from '../../Component/ChatBot/ChatBot';

function Home() {

  const {isAuthenticated} = useCustomerAuth()
  const navigate = useNavigate();
  const handleBookTable = () => {
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/book" } });
  } else {
    navigate("customer/book-table");
  }
};
  
  return (
<div className='home'>
  <div className="home-content">
    <h1>Golden Table</h1>
    <h2>Where Taste Meets Elegance</h2>
    <p className="tagline">
      Experience fine dining crafted with passion, served with perfection.
    </p>
    <p className="hint">
      Reserve your table for an unforgettable experience
    </p>
    <button className="btn-primary" onClick={handleBookTable}>
      Book a Table
    </button>
  </div>
   <ChatBot></ChatBot>
</div>
  )
}

export default Home