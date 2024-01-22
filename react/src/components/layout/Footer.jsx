import React, { useState } from 'react'
import {AiFillHome, AiFillInstagram} from 'react-icons/ai'
import {BsEnvelopeAtFill, BsFillPhoneFill, BsFacebook} from 'react-icons/bs'
import {FaFax} from 'react-icons/fa'
import {BiLogoLinkedinSquare} from 'react-icons/bi'
import axiosClient from '../../axios-client';
import { Link } from 'react-router-dom'


export default function Footer() {

    const [text, setText] = useState('')
    const [reponseChat, setReponseChat] = useState('')
    const [loading, setLoading] = useState(false)
    
    const effacer = (e) => {
        e.preventDefault()
        setText('')
        setReponseChat('')
    }
        
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axiosClient.post('/chat', {question : text})
        .then(({data}) => {
            console.log(data)
            setLoading(false)
            setReponseChat(data.content)
        })
        .catch((err) => {
            console.log(err)
        })
    }

  return (
    <footer className='pt-3 pb-4 poppins'>
        <div className="container">
            {/* LIGNE POUR LE LOGO */}
            <div className="row text-left">
                <div className="col-md-2 text-left">
                    <img src="/logoGampySansBG-2.png" width="150px" height="80px" />
                </div>
            </div>
        </div>
        <div className="container text-center text-md-left">
            {/* LIGNE POUR LES 3 COLONNES PRINCIPALES */}
            <div className="row">
                <div className="col-md-6 m-auto">
                    <div>
                        <form action="#" onSubmit={handleSubmit}>
                            <div><textarea placeholder='Demander un renseignement ...' value={text} onChange={e => setText(e.currentTarget.value)} className='form-control mb-2' style={{ border:'1px solid #25632d', width:'100%' }} name="question" id="question" rows="1"></textarea></div>
                            <button onClick={effacer} className='btn me-2' style={{ backgroundColor: '#25632d', color:'white' }}>Effacer</button>
                            <button className="btn" name='submit' style={{ backgroundColor: '#25632d', color:'white' }} type='submit'>Demander à GampGPT</button>
                        </form>
                    </div>
                </div>
            </div>
            {!loading && reponseChat && (
                <div className="row">
                    <div className="col-md-12 my-2" style={{ border:'1px solid #25632d' }}>
                        {reponseChat}
                    </div>
                </div>
            )}
            {
                loading && (
                    <div>
                        Chargement de la réponse ...
                    </div>
                )
            }
            <div className="row text-center text-md-left mb-3">
                <div className="col-md-1 col-lg-1 col-xl-1"></div>
                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                    <h5 className='text-uppercase mb-4 font-weight-blod'>Gampy</h5>
                    <p>
                        <a href="#" className="text-black" style={{ textDecoration:'none' }}> Notre vision</a>
                    </p>
                    <p>
                        <a href="#" className="text-black" style={{ textDecoration:'none' }}> Qui sommes-nous ?</a>
                    </p>
                    <p>
                        <a href="#" className="text-black" style={{ textDecoration:'none' }}> S'inscrire</a>
                    </p>
                </div>
                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                    <h5 className='text-uppercase mb-4 font-weight-bold'>Informations</h5>
                    <p>
                        {/* <a href="DevenirHote" className="text-black" style={{ textDecoration:'none' }}> Hôtes</a> */}
                        <Link
                            to='/devenirHote'
                            className='text-black'
                            style={{ textDecoration: 'none' }}
                        >Hôtes</Link>
                    </p>
                    <p>
                        {/* <a href="#" className="text-black" style={{ textDecoration:'none' }}> Gampeurs</a> */}
                        <Link
                            to='/devenirHote'
                            className='text-black'
                            style={{ textDecoration: 'none' }}
                        >Gampeurs</Link>
                    </p>
                </div>
                <div className="col-md-3 col-lg3 mx-auto mt-3">
                    <h5 className="text-uppercase mb-4 font-weight-bold">Liens utiles</h5>
                    <p>
                        <a href="#" className="text-black" style={{ textDecoration:'none' }}> FAQ</a>
                    </p>
                </div>
                <div className="col-md-1 col-lg-1 col-xl-1"></div>
            </div>
            {/* LIGNE POUR LES ICONES DES RESEAUX SOCIAUX */}
            <div className="row">
                <div className="col-md-12">
                    <BsFacebook id='iconFacebook' className='mx-3'/> <a href="https://www.instagram.com/gampy_ch/" target='_blank'><AiFillInstagram id='iconInstagram' className='mx-3'/></a> <a href="https://www.linkedin.com/company/gampy/" target='_blank'><BiLogoLinkedinSquare id='iconLinkedIn' className='mx-3'/></a>
                </div>
            </div>
        </div>
    </footer>
  )
}
