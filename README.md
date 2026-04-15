# The Golden Table

A full-stack restaurant table booking system that allows customers to reserve tables online and enables restaurant staff to manage and verify bookings efficiently.

---

## Project Overview

The Golden Table simplifies the traditional restaurant reservation process by digitizing table bookings and management.

Customers can book tables in advance, while restaurant staff can review, verify, and assign tables, ensuring a smooth dining experience.

---

## Features

### Customer Side
- User Registration & Login (OTP-based authentication)
- Browse available tables
- Book tables online

### Staff Side
- Role-based access control for staff users  

#### Staff
- View, manage, and verify customer bookings  
- Approve or reject reservations  
- Add, update, and manage table listings  

#### Manager
- Full access to all staff functionalities  
- Add or remove menu   
- Manage staff-related operations  
---

## Tech Stack

### Frontend
- React.js  

## Frontend Dependencies

- **axios** – For API requests  
- **bootstrap** – UI styling framework  
- **react** – Core frontend library  
- **react-bootstrap** – Bootstrap components for React  
- **react-datepicker** – Date selection for booking  
- **react-dom** – DOM rendering  
- **react-icons** – Icons for UI  
- **react-router-dom** – Routing between pages  
- **react-social-icons** – Social media icons  

### Backend
- Django  
- Django REST Framework (DRF)  

### Database
- SQLite  

### Authentication
- JWT Authentication  
- OTP-based Email Verification (SMTP)  

---

## Authentication Details

- OTP verification is implemented using SMTP  
- Fully functional in local environment  

---

## How It Works

1. User registers and logs in  
2. User browses available tables  
3. User books a table  
4. Staff verifies the booking  
5. Staff assigns the table  

---

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Booking Page
![Booking Page](screenshots/booking.png)

### Cart / Selection Page
![Cart Page](screenshots/cart.png)

### Staff Dashboard
![Dashboard](screenshots/dashboard.png)


---

## Author

Lakshit Poojari  
B.E. Information Technology  
Skills: Python, SQL, Power BI, Django, React  