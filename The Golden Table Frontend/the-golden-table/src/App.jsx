import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from "../src/Routes/AppRoutes"
import { BrowserRouter } from 'react-router-dom'
import { CustomerAuthProvider } from './Context/CustomerAuthContext/CustomerAuthContext'
import { StaffAuthProvider } from './Context/StaffAuthContext/StaffAuthContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <StaffAuthProvider>
          <CustomerAuthProvider>
            <AppRoutes/>
          </CustomerAuthProvider>
        </StaffAuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
