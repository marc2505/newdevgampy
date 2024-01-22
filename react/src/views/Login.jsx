import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';
import ScrollToTop from '../components/ScrollToTop';

export default function Login() {

  const [errors, setErrors] = useState(null)
  const {setUser, setToken} = useStateContext()
  const params = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const nbAdultes = queryParams.get('nbAdultes')
  const nbAdo = queryParams.get('nbAdo')
  const navigate = useNavigate()
  const from = params.from
  console.log(params)
  console.log(queryParams)
  const emailRef = useRef()
  const mdpRef = useRef()

//   window.scrollTo(0,0)

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      from: from || '',
      email: emailRef.current.value,
      password: mdpRef.current.value,
      nbAdultes: nbAdultes,
      nbAdo: nbAdo
    }
    setErrors(null)
    axiosClient.post('/login', payload)
    .then(({data})=>{
      if (data.redirect_to) {
        navigate(data.redirect_to)
      }
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('nbAdultes', data.nbAdultes);
      localStorage.setItem('nbAdo', data.nbAdo);
    })
    .catch((err)=>{
      const response = err.response
      setErrors(response.data.errors)
      if (response && response.status == 422) {
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

  setTimeout(()=>{
    window.scrollTo(0,0)
  })
  
  useEffect(()=>{
    // window.scrollTo(0,0)
    // document.documentElement.scrollTop = 0;
    // document.body.scrollTop = 0;
  }, [])

  useEffect(()=>{
    // window.scrollTo(0,0)
    // window.scroll({ top: 0, behavior: 'smooth' })
    // window.location.reload()
    // alert('From = '+from)
  }, [])

  return (
    <div>
      {/* <ScrollToTop /> */}
      <div className="container" style={{ height:'', marginTop:'50px' }}>
        <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
          <h1 className="text-center mb-5">
            Connexion
          </h1>
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
            <div className="text-left mt-3">
              <p>Vous n'avez pas encore de compte ? <Link to={'/signup'}>Cliquez ici pour vous inscrire.</Link></p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

