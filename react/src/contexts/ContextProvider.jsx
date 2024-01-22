import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
})

export const ContextProvider = ({children}) => {

    const [user, _setUser] = useState(JSON.parse(localStorage.getItem('USER')))
    const [notification, _setNotification] = useState('')
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))

    const setNotification = (msg) => {
        _setNotification(msg)
        setTimeout(()=>{
            _setNotification('')
        }, 5000)
    }

    const setUser = (user) => {
        _setUser(user)
        if (user) {
            let userPublique = {...user}
            delete userPublique.address
            delete userPublique.email
            delete userPublique.email_verified_at
            // delete userPublique.name
            // delete userPublique.image
            delete userPublique.phone_number

            localStorage.setItem('USER', JSON.stringify(userPublique))
        } else {
            localStorage.removeItem('USER')
        }
    }

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    return (
        <StateContext.Provider value={{ 
            user,
            token,
            setUser,
            setToken,
            notification,
            setNotification
         }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)