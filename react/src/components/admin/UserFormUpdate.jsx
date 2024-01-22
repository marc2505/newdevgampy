import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataTableUsers from './DataTableUsers'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'

export default function UserFormUpdate(props) {
  const navigate = useNavigate()
  const {setNotification} = useStateContext()
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isShown, setIsShown] = useState(false)
  const id = props.id
  const [u, setU] = useState({
    id: null,
    name: '',
    pseudo: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleClick = (ev) => {
    ev.preventDefault()
    // setIsShown((current)=>{return !current})
    setIsShown(current=>!current)
  }

  useEffect(()=>{
    setLoading(true)
    axiosClient.get(`/users/${id}`)
    .then(({data})=>{
        setLoading(false)
        // console.log(data)
        // setU(data)
        setU(prevState => ({
            id: data.id || prevState.id,
            name: data.name || prevState.name,
            pseudo: data.pseudo || prevState.pseudo,
            email: data.email || prevState.email,
            password: '',// data.password || prevState.password 
            password_confirmation: '' // data.password_confirmation || prevState.password_confirmation
        }))
    })
    .catch((err)=>{
        setLoading(false)
        console.log(err)
    })
  }, [])

  useEffect(()=>{
    // console.log('CHANGEMENT DE U')
    // console.log(u)
  },[u])

  const onSubmit = (e) => {
    e.preventDefault()
    axiosClient.put(`/users/${u.id}`, u)
    .then(({data})=>{
        // console.log(data)
        setIsShown(current=>!current)
        setNotification('User was successfully updated !')
    })
    .catch((err)=>{
        const response = err.response
        if (response && response.status === 422) {
            setErrors(response.data.errors)
        }
    })
  }

  return (
    // <div className='container'>
    <>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {
                !isShown && <>
                <h3>Modifier l'utilisateur n° {id}</h3>
                <Link className='btn mt-2' style={{ background:'#25632d',color:'white' }} to={'#'} onClick={handleClick}>Retour</Link>
                </>
            }
        </div>
        {
            isShown ?
            <div>
                <DataTableUsers />
            </div>
            :
            <>
            <div>
                {
                    loading && (
                        <div className="text-center">Loading ...</div>
                    )
                }
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
                {
                    !loading && (
                        <form onSubmit={onSubmit}>
                            <input 
                                className='form-control my-2' 
                                value={u.name} 
                                onChange={e=>setU({...u, name: e.target.value})} 
                                placeholder='Name' 
                            />
                            <input 
                                className='form-control my-2' 
                                value={u.pseudo} 
                                onChange={e=>setU({...u, pseudo: e.target.value})} 
                                placeholder='Pseudo' 
                            />
                            <input 
                                type='email' 
                                className='form-control my-2' 
                                value={u.email} 
                                onChange={e=>setU({...u, email: e.target.value})} 
                                placeholder='Email' 
                            />
                            <input 
                                type='password' 
                                className='form-control my-2' 
                                // value={u.password} 
                                autoComplete='new-password'
                                onChange={e=>setU({...u, password: e.target.value})} 
                                placeholder='Password' 
                            />
                            <input 
                                type='password' 
                                className='form-control my-2' 
                                value={u.password_confirmation} 
                                autoComplete='new-password'
                                onChange={e=>setU({...u, password_confirmation: e.target.value})} 
                                placeholder='Confirmed password' 
                            />
                            <button 
                                className="btn" 
                                style={{ background:'#25632d',color:'white' }}
                            >
                                Modifier
                            </button>
                        </form>
                    )
                }
            </div>
            </>
        }
        </>
    // </div>
  )
}
