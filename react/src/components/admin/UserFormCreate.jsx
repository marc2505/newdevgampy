import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataTableUsers from './DataTableUsers'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'

export default function UserFormCreate() {
  const navigate = useNavigate()
  const {setNotification} = useStateContext()
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [photo, setPhoto] = useState('')
  const [afficher, setAfficher] = useState(false)
  const [u, setU] = useState({
    id: null,
    name: '',
    pseudo: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
    role: 'user',
    biographie: '',
  })

  const handleClick = (ev) => {
    ev.preventDefault()
    // setIsShown((current)=>{return !current})
    setIsShown(current=>!current)
  }

  useEffect(()=>{
    // setLoading(true)
    // axiosClient.get(`/users/${id}`)
    // .then(({data})=>{
    //     setLoading(false)
    //     console.log(data)
    //     setU(data)
    // })
    setLoading(false)
    // .catch((err)=>{
    //     setLoading(false)
    //     console.log(err)
    // })
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', u.name)
    formData.append('pseudo', u.pseudo)
    formData.append('email', u.email)
    formData.append('password', u.password)
    formData.append('password_confirmation', u.password_confirmation)
    formData.append('phone_number', u.phone_number)
    formData.append('date_of_birth', u.date_of_birth)
    formData.append('address', u.address)
    formData.append('biographie', u.biographie)
    formData.append('image', u.image)
    formData.append('role', u.role)
    

    // console.log('U = ')
    // console.log(u)
    // console.log('FORMDATA = ')
    // console.log(formData)
    // return

    axiosClient.post(`/users`, formData)
    .then(({data})=>{
        console.log(data)
        setIsShown(current=>!current)
        setNotification('User was successfully created !')
    })
    .catch((err)=>{
        const response = err.response
        if (response && response.status === 422) {
            setErrors(response.data.errors)
        }
    })
  }

  const handleFileChange = (e) => {
    // e.preventDefault()
    console.log(e.target.files[0])
    setPhoto('')
    setAfficher(false)
    if (e.target.files) {
        const file = e.target.files[0]
        const fichier = URL.createObjectURL(e.target.files[0])
        setPhoto(fichier)
        setAfficher(true)
        setU({...u, image: file})
        URL.revokeObjectURL(e.target.files[0])
    }
    // e=>setU({...u, image: e.target.value})
  }

  const renderPhoto = (photo) => {
    // console.log(photo)
    // return
    return (
        <>
        {
        afficher ??
        <img 
            src={photo} 
            style={{ width:'20%',height:'200px',margin:'0 5px' }}
        />
        }
        </>
    )
  }

  return (
    <>
    {/* <div className='container'>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {
                    !isShown && <>
                    <h3>Ajouter un utilisateur</h3>
                    <Link to={'#'} onClick={handleClick}>Retour</Link>
                    </>
                }
            </div>
            {
                isShown ? 
                <div>
                    <DataTableUsers />
                </div>
                : 
                <div>
                    <p>
                        Formulaire d'ajout ...
                    </p>
                </div>
            }
        </div>
    </div> */}
    {
        !isShown ?
        <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3>Formulaire d'ajout</h3>
                <Link className='btn mt-2' style={{ background:'#25632d',color:'white' }} to={'#'} onClick={handleClick}>Retour</Link>
            </div>
            <div>
                {
                    loading ??
                    <div className="text-center">Loading ...</div>
                    
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
                    !loading &&
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
                                value={u.password} 
                                onChange={e=>setU({...u, password: e.target.value})} 
                                placeholder='Password' 
                            />
                            <input 
                                type='password' 
                                className='form-control my-2' 
                                value={u.password_confirmation} 
                                onChange={e=>setU({...u, password_confirmation: e.target.value})} 
                                placeholder='Confirmed password' 
                            />
                            <input 
                                className='form-control my-2' 
                                value={u.phone_number} 
                                onChange={e=>setU({...u, phone_number: e.target.value})} 
                                placeholder='Phone number' 
                            />
                            <input 
                                className='form-control my-2'
                                type="date" 
                                value={u.date_of_birth}
                                onChange={e=>setU({...u, date_of_birth: e.target.value})}
                            />
                            <input 
                                className='form-control my-2' 
                                value={u.address} 
                                onChange={e=>setU({...u, address: e.target.value})} 
                                placeholder='Address' 
                            />
                            {/* 
                            FAIRE UN SELECT A LA PLACE DE CE INPUT
                            <input className='form-control my-2' value={u.role} onChange={e=>setU({...u, role: e.target.value})} placeholder='Role' /> 
                            */}
                            <textarea 
                                className='form-control my-2' 
                                value={u.biographie} 
                                onChange={e=>setU({...u, biographie: e.target.value})} 
                                rows="5" 
                                placeholder='Biographie'
                            ></textarea>
                            <input 
                                type='file' 
                                name='file'
                                className='form-control my-2'
                                onChange={handleFileChange} 
                            />
                            <div style={{ textAlign:'center' }}>
                                {
                                    renderPhoto(photo)
                                }
                            </div>
                            <button className="btn" style={{ background:'#25632d',color:'white' }}>
                                Ajouter
                            </button>
                        </form>
                    }
                </div>
            </>
            :
            <DataTableUsers />
        }
    </>
  )
}
