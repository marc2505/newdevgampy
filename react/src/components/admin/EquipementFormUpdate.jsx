import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataTableUsers from './DataTableUsers'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'
import DataTableEquipements from './DataTableEquipements'

export default function EquipementFormUpdate(props) {
  const navigate = useNavigate()
  const {setNotification} = useStateContext()
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isShown, setIsShown] = useState(false)
  const [photos,setPhotos] = useState([])
  const [photosMod,setPhotosMod] = useState([])
  const [formSubmitted,setFormSubmitted] = useState(false)
  const id = props.id
  const [e, setE] = useState({
    id: null,
    nom: '',
    images: '',
  })

  const handleClick = (ev) => {
    ev.preventDefault()
    // setIsShown((current)=>{return !current})
    setIsShown(current=>!current)
  }

useEffect(()=>{
    // console.log('change :')
    // console.log(e)
}, [e])

  useEffect(()=>{
    setLoading(true)
    axiosClient.get(`/admin/equipements/${id}`)
    .then(({data})=>{
        setLoading(false)
        // console.log('DATA.DATA =')
        // console.log(data.data)
        setE(data.data)
        const pTab = data?.data?.images
        if (pTab) {
            const pArray = pTab.split('|')
            // console.log('pArray =')
            // console.log(pArray)
            setPhotosMod(pArray)
        } else {
            setPhotosMod([])
        }
    })
    .catch((err)=>{
        setLoading(false)
        console.log(err)
    })
  }, [])

  const onSubmit = (ev) => {
    ev.preventDefault()
    const formData = new FormData()

    formData.append('nom', e.nom)

    let files = ev.target[1].files;
    let totalSize = 0
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i])
        }
    }
    let date = new Date();
    let current_date =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate();
    let current_time =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let date_time = current_date + " " + current_time;
    formData.append("updatedAt", date_time);

    axiosClient.post(`/admin/equipements/${e.id}`, formData)
    .then(({data})=>{
        // console.log(data)
        setIsShown(current=>!current)
        setNotification('Equipement was successfully updated !')
        window.scrollTo(0,0)
    })
    .catch((err)=>{
        const response = err.response
        if (response && response.status === 422) {
            setErrors(response.data.errors)
        }
    })
  }

  const handlePhotosMod = (e) => {
    setPhotosMod([])
    setFormSubmitted(true)
    if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file) => {
            return URL.createObjectURL(file)
        })
        setPhotosMod((prevImage) => prevImage.concat(filesArray))
        Array.from(e.target.files).map((file) => {
            return URL.revokeObjectURL(file)
        })
    }
  }
  
useEffect(()=>{
    // console.log('PHOTOSMOD = ')
    // console.log(photosMod)
}, [photosMod])

  return (
    // <div className='container'>
    <>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {
                !isShown && <>
                    <h3>Modifier l'équipement n° {id}</h3>
                    <Link 
                        className='btn mt-2' 
                        style={{ background:'#25632d',color:'white' }} 
                        to={'#'} 
                        onClick={handleClick}
                    >
                        Retour
                    </Link>
                </>
            }
        </div>
        {
            isShown ?
            <div>
                <DataTableEquipements />
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
                                value={e.nom} 
                                onChange={ev=>setE({...e, nom: ev.target.value})} 
                                placeholder='Nom' 
                            />
                            <input 
                                type='file'
                                className='form-control my-2' 
                                onChange={handlePhotosMod} 
                                multiple
                            />
                            <div className='mt-3' style={{ textAlign: 'center' }}>
                                {/* {
                                    !formSubmitted ?
                                    renderPhotosMod(photosMod)
                                    :
                                    renderPhotos(photosMod)
                                } */}
                                {
                                    !formSubmitted ?
                                    photosMod && photosMod.map(url => {
                                        return (
                                            <img 
                                                src={'http://localhost:8000/'+url} 
                                                alt="" 
                                                key={url}
                                                style={{ width:'250px',height:'150px' }}
                                            />
                                        )
                                    })
                                    :
                                    photosMod && photosMod.map(url => {
                                        return (
                                            <img 
                                                src={url} 
                                                alt="" 
                                                key={url}
                                                style={{ width:'250px',height:'150px' }}
                                            />
                                        )
                                    })
                                }
                                {
                                    photosMod.length == 0 && (
                                        <div className='d-flex justify-content-center align-items-center' style={{ height:'150px',border:'1px solid #25632d' }}>
                                            Pas de photo ...
                                        </div>
                                    )
                                }
                            </div>
                            <button 
                                className="btn mt-3" 
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
