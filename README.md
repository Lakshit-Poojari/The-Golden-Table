The Golden Table

A full-stack restaurant table booking system that allows customers to reserve tables online and enables restaurant staff to manage and verify bookings efficiently.

Project Overview

The Golden Table simplifies the traditional restaurant reservation process by digitizing table bookings and management.

Customers can book tables in advance, while restaurant staff can review, verify, and assign tables, ensuring a smooth dining experience.

Features
Customer Side
User Registration & Login (OTP-based authentication)
Browse available tables
Book tables online
Search and filter tables/products
Add items to cart with quantity management
Submit feedback with image upload
Staff (Seller) Side
Staff login system
View and manage customer bookings
Verify reservations
Add, update, and manage table/product listings
Tech Stack
Frontend
React.js
Context API
Backend
Django
Django REST Framework (DRF)
Database
SQLite
Authentication
JWT Authentication
OTP-based Email Verification (SMTP)
Deployment
Render (Frontend deployed)
Live Demo

Frontend:
https://the-golden-table-frontend.onrender.com/

Note:
Backend features (authentication & booking APIs) work perfectly in the local environment.
Due to Render free-tier limitations (SMTP restrictions), OTP-based authentication is not functional in the deployed version.

Installation and Setup
Clone Repository
git clone https://github.com/your-username/the-golden-table.git
cd the-golden-table
Backend Setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Backend runs at:
http://127.0.0.1:8000/

Frontend Setup
cd frontend
npm install
npm start

Frontend runs at:
http://localhost:3000/

Project Structure
the-golden-table/
│
├── backend/
│   ├── customer_side/
│   ├── seller_side/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
└── README.md
Authentication Details
OTP verification is implemented using SMTP.
Fully functional in local environment.
Not working in deployed version due to Render SMTP restrictions.
How It Works
User registers and logs in
User browses available tables
User books a table
Staff verifies the booking
Staff assigns the table
Future Improvements
Deploy backend with SMTP support
Add payment integration
Real-time booking system
Notifications (Email/SMS)
UI/UX improvements
Author

Lakshit Poojari
B.E. Information Technology
Skills: Python, SQL, Power BI, Django, React

Contribution

Contributions are welcome. Fork the repository and create a pull request.