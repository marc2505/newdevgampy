import React, { useEffect, useState } from 'react'
import DataTablePrestations from './DataTablePrestations'
import { Link } from 'react-router-dom'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'

export default function PrestationFormUpdate(props) {
    const {setNotification} = useStateContext()
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(true)
    const [terrains, setTerrains] = useState([])
    const [terrainId, setTerrainId] = useState(null)
    const [isShown, setIsShown] = useState(false)
    const [photosMod,setPhotosMod] = useState([])
    const [formSubmitted,setFormSubmitted] = useState(false)
    const id = props.id
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
    const handleTerrain = (e) => {
        e.preventDefault()
        // console.log('VALEUUUUUUUUUUUUR = ')
        // console.log(e.target.value)
        // setTerrain(prev => ({...prev, user_id: e.target.value}))
        setTerrainId(Number(e.target.value))

    }
    
    useEffect(()=>{
        if (terrainId) {
            axiosClient.get(`/admin/terrains/${terrainId}/getPrestations`)
            .then(({data}) => {
                console.log('RETOUR DE /ADMIN/TERRAINS/ID/GETPRESTATIONS')
                console.log(data.prestations)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }, [terrainId])

    const onSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('nom', p.nom)
        formData.append('description', p.description)
        formData.append('prix', p.prix)

        let files = e.target[3].files;

        if (files && files.length > 0) {
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
        axiosClient.post(`/admin/prestations/${p.id}`, formData)
        .then(({data}) => {
            setIsShown(current=>!current)
            setNotification('Prestation was successfully updated !')
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
        setPhotosMod([]);
        setFormSubmitted(true);
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => {
                return URL.createObjectURL(file);
            });
            setPhotosMod((prevImage) => prevImage.concat(filesArray));
            Array.from(e.target.files).map((file) => {
                return URL.revokeObjectURL(file);
            });
        }
    }
    useEffect(()=>{
        setLoading(true)
        axiosClient.get(`/admin/prestations/${id}`)
        .then(({data}) => {
            // setLoading(false)
            setP(data.data)
            const pTab = data?.data?.images
            if (pTab) {
                const pArray = pTab.split('|')
                setPhotosMod(pArray)
            } else {
                setPhotosMod([])
            }
        })
        .catch((err)=>{
            // setLoading(false)
            console.log(err)
        })
        axiosClient.get('/terrains')
        .then(({data}) => {
            // setLoading(false)
            setTerrains(data.data)
        })
        .catch((err) => {
            // setLoading(false)
            console.log(err)
        })
        axiosClient.get(`/admin/prestations/${id}`)
        .then(({data}) => {
            setLoading(false)
            console.log('Retour de /prestations/id')
            console.log(data.data)
            setTerrainId(data.data.terrain_id)
        })
        .catch((err) => {
            setLoading(false)
            console.log(err)
        })
    }, [])
    return (
        <>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {
                !isShown && <>
                    <h3>Modifier la prestation n° {id}</h3>
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
                <DataTablePrestations />
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
                                    value={terrainId}
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
                            value={p.nom} 
                            onChange={ev=>setP({...p, nom: ev.target.value})} 
                            placeholder='Nom' 
                        />
                        <input 
                            id='prix'
                            className='form-control my-2'
                            value={p.prix} 
                            onChange={ev=>setP({...p, prix: ev.target.value})} 
                            type="number" 
                            step={'0.05'}
                            min={'0.00'}
                            placeholder='Prix'
                        />
                        <textarea 
                            className='form-control my-2'
                            id="desc" 
                            rows="5"
                            value={p.description} 
                            onChange={ev=>setP({...p, description: ev.target.value})} 
                            placeholder='Description'
                        ></textarea>
                        <input 
                            type="file" 
                            className='form-control my-2'
                            onChange={handlePhotosMod}
                            multiple
                        />
                        <div className='mt-3' style={{ textAlign: 'center' }}>
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
                }
            </div>
            </>
        }
        </>
    )
}
