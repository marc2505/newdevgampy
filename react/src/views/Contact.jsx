import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function Contact() {
  const {user, token} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))
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
        <div className="container">
          <h1>Contact</h1>
        </div>
      </div>
      <div className="container">
        <Footer />
      </div>
    </div>
  )
}
