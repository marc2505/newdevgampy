import React, { useEffect, useState } from 'react'
import DataTablePrestations from './DataTablePrestations'
import { Link } from 'react-router-dom'
import { useStateContext } from '../../contexts/ContextProvider'
import axiosClient from '../../axios-client'

export default function PrestationFormCreate() {
    const {user, setNotification} = useStateContext()
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isShown, setIsShown] = useState(false)
    const [users, setUsers] = useState([])
    const [terrains, setTerrains] = useState([])
    const [terrainId, setTerrainId] = useState(null)
    const [photos,setPhotos] = useState([])
    const [p, setP] = useState({
        id: null,
        nom: '',
        description: '',
        prix: 0.0,
        images: '',
    })

    

    const handleClick = (ev) => {
        ev.preventDefault()
        // setIsShown((current)=>{return !current})
        setIsShown(current=>!current)
        window.scrollTo(0,0)
    }

    useEffect(()=>{
        setLoading(true)
        // axiosClient.get(`/users/${id}`)
        // .then(({data})=>{
        //     setLoading(false)
        //     console.log(data)
        //     setU(data)
        // })
        axiosClient.get('/users')
        .then(({data}) => {
            setLoading(false)
            // console.log('VOICI LES UTILISATEURS :')
            // console.log(data.data)
            // alert(3)
            setUsers(data.data)
        })
        .catch((err) => {
            setLoading(false)
            console.log(err)
        })
        axiosClient.get('/terrains')
        .then(({data}) => {
            setTerrains(data.data)
            // console.log(data.data)
        })
        .catch((err) => {
            console.log(err)
        })
        // setLoading(false)
        // .catch((err)=>{
        //     setLoading(false)
        //     console.log(err)
        // })
    }, [])

    const handleTerrain = (e) => {
        e.preventDefault()
        // console.log('VALEUUUUUUUUUUUUR = ')
        // console.log(e.target.value)
        // setTerrain(prev => ({...prev, user_id: e.target.value}))
        setTerrainId(Number(e.target.value))

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

    const onSubmit = (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append('nom', p.nom)
        formData.append('terrain_id', Number(terrainId))
        formData.append('description', p.description)
        formData.append('prix', Number(p.prix))
        var images = e.target[4].files
        for (let i=0; i<images.length; i++) {
            formData.append('images[]', images[i])
        }

        axiosClient.post('/admin/prestations', formData)
        .then(({data}) => {
            console.log('RETOUR DE L\'APPEL POST => /ADMIN/PRESTATIONS')
            console.log(data)
            setIsShown(current=>!current)
            setNotification('Prestation was successfully created !')
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
        {
            !isShown ?
            <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3>Formulaire d'ajout de prestations</h3>
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
                        <div className='my-3 col-md-6 mx-auto'>
                            <h3>Choisir un utilisateur</h3>
                            <div className="form-floating">
                                <select 
                                    className="form-select" 
                                    onChange={handleTerrain}
                                    id="floatingSelect2"
                                    // size={6}
                                    // value={terrain.user_id !== null ? terrain.user_id : ''}
                                >
                                    <option defaultValue>Choisir d'un terrain</option>
                                    {/* mapper sur les users */}
                                    {
                                        // users.length > 0 && users.map((u,cle) => {
                                        //     return <option value={u.id} key={cle}>{u.name}</option>
                                        // })
                                        terrains.length > 0 && terrains.map((t,cle) => {
                                            return <option value={t.id} key={cle}>{t.nom}</option>
                                        })
                                    }
                                </select>
                                <label htmlFor="floatingSelect2">Choix d'un terrain à relier à la prestation</label>
                            </div>
                        </div>
                        <input 
                            className='form-control my-2' 
                            id='nom'
                            // value={p.nom} 
                            onChange={ev=>setP({...p, nom: ev.target.value})} 
                            placeholder='Nom' 
                        />
                        <input 
                            id='prix'
                            className='form-control my-2'
                            type="number" 
                            step={'0.05'}
                            min={'0.00'}
                            // value={p.prix}
                            onChange={ev=>setP({...p, prix: Number(ev.target.value)})}
                            placeholder='Prix'
                        />
                        <textarea 
                            className='form-control my-2'
                            id="desc" 
                            rows="5"
                            onChange={ev=>setP({...p, description: ev.target.value})}
                            placeholder='Description'
                        ></textarea>
                        <input 
                            type="file" 
                            className='form-control my-2'
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
        <DataTablePrestations />
        }
        </>
    )
}
