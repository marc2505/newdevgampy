import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import Header from './layout/Header'
import Footer from './layout/Footer'
import axiosClient from '../axios-client'
import ScrollToTop from './ScrollToTop'

export default function DefaultLayout() {

  const {user, token, setUser, setToken} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))

  useEffect(()=>{
    axiosClient.get('/user')
    .then(({data})=>{
      setUser(data)
    })
  }, [])

  if (!token) {
    return <Navigate to={'/'} />
  }

  return (
    <div>
      <div className="container mx-auto">
      {
          userLocal && Object.keys(userLocal).length > 0
          ?
          <Header user={userLocal} />
          :
          <Header user={null} />
        }
      </div>
      <div className="container">
        {/* <ScrollToTop /> */}
        <Outlet />
      </div>
      <div className="container">
        <Footer />
      </div>
    </div>
  )
}
