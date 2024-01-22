import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import Header from './layout/Header'
import Footer from './layout/Footer'
import axiosClient from '../axios-client'
import ScrollToTop from './ScrollToTop'

export default function AdminLayout() {

  const [loading, setLoading] = useState(true)
  const {user, token, setUser, setToken, notification} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))

  useEffect(()=>{
    setLoading(true)
    axiosClient.get('/user')
    .then(({data})=>{
      setLoading(false)
      setUser(data)
    })
  }, [])

  if (userLocal?.role != 'admin') {
    return <Navigate to={'/'} />
  }

  if (!token) {
    return <Navigate to={'/admin/login'} />
  } 

  const onLogout = (ev) => {
    ev.preventDefault()
    
  }

  return (
    <>
    {
      loading
      ?
      <div>
        <h5 className="text-center">
          Chargement ...
        </h5>
      </div>
      :
      <div>
        <div className="container mx-auto">
          {
            userLocal && Object.keys(userLocal).length > 0
            ?
            <Header user={userLocal} />
            :
            <Header user={null} />
          }
          {
            notification && (
                <div style={{ textAlign:'center',background:'green',color:'white',fontWeight:'bold',padding:'15px 10px' }}>
                    {
                        notification
                    }
                </div>
            )
          }
        </div>
        <ScrollToTop />
        <Outlet />
        <div className="container">
          <Footer />
        </div>
      </div>
    }
    </>
  )
}
