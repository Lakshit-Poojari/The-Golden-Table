import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CustomerMainLayout from '../Layouts/CustomerMainLayout/CustomerMainLayout'
import Home from '../Customer/Home/Home'
import About from '../Customer/About/About'
import Services from '../Customer/Services/Services'
import Menu from '../Customer/Menu/Menu' 
import Contact from '../Customer/Contact/Contact'
import CustomerLogin from '../Auth/CustomerLogin/CustomerLogin'
import CustomerRegister from '../Auth/CustomerRegister/CustomerRegister'
import BookTable from '../Customer/BookTable/BookTable'
import MyBookings from '../Customer/MyBookings/MyBookings'
import StaffLogin from '../Auth/StaffLogin/StaffLogin'
import ProtectedStaffRoute from '../Auth/ProtectedStaffRoute/ProtectedStaffRoute'
import StaffDashboard from '../Staff/StaffDashboard/StaffDashboard'
import BookingList from '../Staff/BookingList/BookingList'
import VerifyOTP from '../Auth/VerifyOTP/VerifyOTP'
import Profile from '../Customer/Profile/Profile'
import ManageMenu from '../Staff/ManageMenu/ManageMenu'
import StaffBookings from '../Staff/StaffBookings/StaffBookings'
import CheckInVerification from '../Auth/CheckInVerification/CheckInVerification'
import ForgotPassword from '../Customer/ForgotPassword/ForgotPassword'

function AppRoutes() {
  return (
    <>
        <Routes>
          {/* customer side */}
            <Route path="/" element={<CustomerMainLayout />}>
              <Route path='/' element={<Home/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/services' element={<Services/>}/>
              <Route path='/menu' element={<Menu/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/login' element={<CustomerLogin/>}/>
              <Route path='/register' element={<CustomerRegister/>}/>
              <Route path='/verify-otp' element={<VerifyOTP/>}/>
              <Route path='/customer/profile' element={<Profile/>}/>
              {/* customer side auth */}
              <Route path='/customer/book-table' element={<BookTable/>}/>
              <Route path='/customer/my-booking' element={<MyBookings/>}/>
              <Route path='/forgot-password' element={<ForgotPassword/>}/>
            </Route>
            {/* staff side public */}
            <Route path='/staff/login' element={<StaffLogin/>}/>
            {/* staff side auth */}
            <Route element = {<ProtectedStaffRoute/>}>
              <Route path='/staff/dashboard' element={<StaffDashboard/>}/>
              <Route path='/staff/bookings' element={<BookingList/>}/>
              <Route path='/staff/menu' element={<ManageMenu/>}/>
              <Route path='/staff/StaffBookings' element={<StaffBookings/>}/>
              {/* <Route path='/staff/verifyotp' element={<CheckInVerification/>}/> */}
            </Route>
        </Routes>
    </>
  )
}

export default AppRoutes