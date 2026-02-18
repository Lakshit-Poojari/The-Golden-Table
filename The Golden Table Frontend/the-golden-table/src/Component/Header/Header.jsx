import React from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../../Context/CustomerAuthContext/CustomerAuthContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../../assets/Images/logo.png"
import "./Header.css"

function Header() {
  const { isAuthenticated, logout } = useCustomerAuth();

  return (
<Navbar collapseOnSelect expand="lg"  className="border-bottom  main-navbar">
    {/* Brand */}
    <Navbar.Brand as={Link} className="main-logo" to="/">
      <img className="logo" src={logo} alt="Restaurant Logo" />
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

    <Navbar.Collapse id="responsive-navbar-nav">
      {/* LEFT SIDE – always visible */}
      <Nav className="me-auto ">
        <Nav.Link as={Link} className="yellow" to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/about">About</Nav.Link>
        <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
        
        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
        <Nav.Link as={Link} to="/customer/book-table">Book Table</Nav.Link>
      </Nav>

      {/* RIGHT SIDE – auth based */}
      <Nav>
        {isAuthenticated ? (
          <>
            
            <Nav.Link as={Link} to="/customer/my-booking">
              My Bookings
            </Nav.Link>
            <Nav.Link as={Link} to="/customer/profile">
              Profile
            </Nav.Link>
            <Nav.Link onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/customer/profile">
              Profile
            </Nav.Link>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
</Navbar>

    
  );
}

export default Header;
