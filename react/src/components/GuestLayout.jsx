import React, { useEffect } from 'react'
import { Navigate, Outlet, redirect, useLocation } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import Header from './layout/Header'
import Footer from './layout/Footer'
import ScrollToTop from './ScrollToTop'

export default function GuestLayout() {

    const {user, token} = useStateContext()
    const userLocal = JSON.parse(localStorage.getItem('USER'))
    const {pathname} = useLocation()

    if (token) {
        return <Navigate to={'/home'} />
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
                <Outlet />
            </div>
            <div className="container">
                <Footer />
            </div>
        </div>
    )
}
