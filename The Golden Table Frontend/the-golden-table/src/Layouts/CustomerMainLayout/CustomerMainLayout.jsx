import React from 'react'
import Header from '../../Component/Header/Header'
import { Outlet } from 'react-router-dom'

function CustomerMainLayout() {
  return (
    <>
        <Header/>
        <Outlet/>
    </>
  )
}

export default CustomerMainLayout