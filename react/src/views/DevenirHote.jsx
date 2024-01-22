import React, { useCallback, useEffect, useRef } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import InfosHotes from './InfosHotes'
import InfosCamps from './InfosCamps'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Fonctionnement from './Fonctionnement'

export default function DevenirHote() {

  const {user, token} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))
  const navigate = useNavigate()

//   useEffect(()=>{
//     window.scrollTo(0,0)
//   }, [])

  setTimeout(() => {
    window.scrollTo(0,0)
  })

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
          <h1 className='text-center'>Devenir hôte</h1>
          <Row className='align-items-center text-center mb-5' style={{ height:'' }}>
            <Col xs='12' sm='10' md='6' lg='4' style={{ height: '', margin:'auto' }}>
                <h3 className="text-center">
                    Infos hôtes
                </h3>
                <a href="2.png" target='_blank' style={{ height:'100%', width: '100%', display: 'block' }}>
                    <img src="1.png" className='imgMobile' style={{ height:'550px', width: '100%' }} />
                </a>
            </Col>
            <Col xs='12' sm='10' md='6' lg='4' style={{ height: '', margin:'auto' }}>
                <h3 className="text-center">
                    Infos camps
                </h3>
                <a href="Vous avez dit Hôtes_2.png" target='_blank' style={{ height:'100%', width: '100%', display: 'block' }}>
                    <img src="Vous avez dit Hôtes.png" className='imgMobile' style={{ height:'550px', width: '100%' }} />
                </a>
            </Col>
          </Row>
          <br />
          <Fonctionnement />

          <Row className='mt-5 text-center'>
            <Col>
                {
                    userLocal && (
                    <a href="/annonce" style={{ background:'#25632d', color:'white' }} className='btn'>Créer une annonce</a>
                    )
                }
                {
                    !userLocal && (
                    <a href="/login/devenirhote" style={{ background:'#25632d', color:'white' }} className='btn'>Créer une annonce</a>
                    )
                }
                
            </Col>
          </Row>
        </div>
      </div>
      <div className="container">
        <Footer />
      </div>
    </div>
  )
}
