import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'
import DataTableEquipements from './DataTableEquipements'

export default function EquipementFormCreate() {
  const navigate = useNavigate()
  const {setNotification} = useStateContext()
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [photos,setPhotos] = useState([])
  const [e, setE] = useState({
    id: null,
    nom: '',
  })

  const handleClick = (ev) => {
    ev.preventDefault()
    // setIsShown((current)=>{return !current})
    setIsShown(current=>!current)
  }

  const renderPhotos = (source) => {
    return source.map(photo=>{
        // console.log(photo)
        return ( 
            <img 
                src={photo.split('|').at(0)} 
                alt="" 
                key={photo} 
                style={{ width:'20%',height:'180px',margin:'0 5px' }} 
            />
        )
    })
}

const handlePhotos = (e) => {
    setPhotos([])
    if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file)=>{
            return URL.createObjectURL(file)
        })
        setPhotos(prevImage => prevImage.concat(filesArray))
        Array.from(e.target.files).map((file)=>{
            return URL.revokeObjectURL(file)
        })
    }
    // console.log(photos)
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

  const onSubmit = (ev) => {
    ev.preventDefault()

    const formData = new FormData()
    formData.append('nom', e.nom)
    // formData.append('image', e.image)
    // formData.append('email', u.email)
    // formData.append('password', u.password)
    // formData.append('password_confirmation', u.password_confirmation)
    // formData.append('phone_number', u.phone_number)
    // formData.append('date_of_birth', u.date_of_birth)
    // formData.append('address', u.address)
    // formData.append('biographie', u.biographie)
    // formData.append('image', u.image)
    // formData.append('role', u.role)


    var images = ev.target[1].files
    for(let i=0; i<images.length; i++) {
        formData.append('images[]', images[i])
    }

    console.log('E = ')
    console.log(e)
    console.log('FORMDATA = ')
    console.log(formData)

    axiosClient.post(`/admin/equipements`, formData)
    .then(({data})=>{
        console.log(data)
        setIsShown(current=>!current)
        setNotification('Equipement was successfully created !')
        window.scrollTo(0,0)
    })
    .catch((err)=>{
        const response = err.response
        if (response && response.status === 422) {
            setErrors(response.data.errors)
        }
    })
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
                <h3>Formulaire d'ajout d'équipements</h3>
                <Link 
                    className='btn mt-2' 
                    style={{ background:'#25632d',color:'white' }} 
                    to={'#'} 
                    onClick={handleClick}
                >
                    Retour
                </Link>
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
                                value={e.nom} 
                                onChange={ev=>setE({...e, nom: ev.target.value})} 
                                placeholder='Nom' 
                            />
                            <br />
                            <input 
                                type="file" 
                                className='form-control'
                                onChange={handlePhotos}
                                multiple
                            />
                            <div className='mt-3' style={{ textAlign: 'center' }}>
                                {
                                    renderPhotos(photos)
                                }
                            </div>
                            <button 
                                className="btn mt-3" 
                                style={{ background:'#25632d',color:'white' }}
                            >
                                Ajouter
                            </button>
                        </form>
                    }
                </div>
            </>
            :
            <DataTableEquipements />
        }
    </>
  )
}
