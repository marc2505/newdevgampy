import React, { useEffect } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'

export default function Cancel() {
    const {user, token} = useStateContext()
    useEffect(()=>{
        
    }, [])
    return (
        <div>
            <h1>
                Cancel page
            </h1>

            <br /><br />

            <h2>
                {user.name}, votre réservation a été annulée ... 
            </h2>

            <br /><br />
        </div>
    )
}
