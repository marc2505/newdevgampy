import React, { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useStateContext } from '../../contexts/ContextProvider';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';


export default function LoginAdmin() {

  const [errors, setErrors] = useState(null)
  const {user, token, setUser, setToken} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))
  const navigate = useNavigate();
  const emailRef = useRef()
  const mdpRef = useRef()


  useEffect(()=>{
    // console.log(user)
    
  }, [])

  if (user && Object.keys(user).length>0) {
    // alert('QQUN EST CONNECTE ...')
    if (user.role == 'user') {
      // alert('ET CE N\'EST PAS UN ADMIN ...')
      return <Navigate to={'/home'} />
    } else if (user.role == 'admin') {
      // alert('MAIS C\'EST UN ADMIN ALORS TOUT VA BIEN !')
      return <Navigate to={'/admin'} />
    }
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    // alert('Implémenter la connexion admin ici ...')
    const payload = {
      email: emailRef.current.value,
      password: mdpRef.current.value
    }
    setErrors(null)
    axiosClient.post('/loginAdmin', payload)
    .then(({data})=>{
      setUser(data.user)
      setToken(data.token)
      // navigate('/admin')
    }).catch(err=>{
      const response = err.response;
      if (response && (response.status === 422 || response.status === 404)) {
        if (response.data.errors) {
          setErrors(response.data.errors)
        } else {
          setErrors({
              email: [response.data.message]
          })
        }
      }
    })
  }

  return (
    <div>
      <div className="container mx-auto">          
        <Header user={null} />
      </div>
      <div className="container">
        <h1 className="text-center mb-5">
          Connexion administrateur
        </h1>
        <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
          {
            errors && <div style={{ color:'red' }}>
              {
                Object.keys(errors).map(key=>(
                  <div key={key}>
                    {errors[key][0]}
                  </div>
                ))
              }
            </div>
          }
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>Adresse email :</Form.Label>
              <Form.Control ref={emailRef} type="email" placeholder="Entrer votre adresse email" />
              {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
            </Form.Group>

            <Form.Group className="mb-5" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control ref={mdpRef} type="password" placeholder="Password" />
            </Form.Group>
            
            <div className="text-center">
              <Button 
                // variant="primary" 
                style={{ backgroundColor: '#25632d', color: 'white', outline: 'none', border: 'none' }}
                type="submit"
              >
                Se connecter
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="container">
        <Footer />
      </div>
    </div>
  )
}
