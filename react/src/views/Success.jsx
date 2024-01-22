import React, { useEffect } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'
import { useLocation } from 'react-router-dom'

export default function Success() {
    const {user, token} = useStateContext()
    const location = useLocation()
    const sessionId = new URLSearchParams(location.search).get('session_id')
    useEffect(()=>{
        // console.log('USER STATE CONTEXT :')
        // console.log(user)
        console.log('SESSION_ID :')
        console.log(sessionId)
        axiosClient.post('/validation_paiement', {session_id: sessionId})
        .then(({data}) => {
            console.log('RETOUR DU SUCCESS')
            console.log(data)
            console.log('USERRR =')
            console.log(user)
            return axiosClient.post('/sendMail', {
                hote: data.hote,
                gampeur: user
            })
        })
        .then(({data}) => {
            console.log('RETOUR DU DEUXIEME SUCCESS')
            console.log(data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div>
            <h1>
                Success page
            </h1>

            <br /><br />

            <h2>
                Merci pour votre réservation {user.name}
            </h2>

            <br /><br />
        </div>
    )
}
