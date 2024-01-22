import React, { useEffect, useState } from 'react'
import EquipementPhotos from './EquipementPhotos'
import axiosClient from '../axios-client'

export default function Equipements(props) {
    const t = props.terrain
    const [newCheckboxChecked, setNewCheckboxChecked] = useState([])
    const [equipements, setEquipements] = useState([])
    const [loading, setLoading] = useState(true)
    let index = 0
    useEffect(()=>{
        setLoading(true)
        axiosClient.get('/equipements')
        .then(({data}) => {
            setLoading(false)
            // console.log('RETOUR ...')
            // console.log(data.data)
            // setEquipements(data.data)
            setEquipements(data.data.map(equipement => ({...equipement, photos: [], showPhotos: false})))
            setShowPhotosEquip(new Array(data.data.length).fill(false))
        })
        .catch((err) => {
            setLoading(false)
            console.log(err)
        })
        if (t.id) {
            setNewCheckboxChecked(t.equipements.split('|'))
        } 
    }, [])

    useEffect(()=>{
        // console.log('CHANGEMENT DE LA LISTE EQUIPEMENTS : ')
        // console.log(equipements)
    }, [equipements])

    const [showPhotosEquip, setShowPhotosEquip] = useState([]);
    // const [cIdState, setCIdState] = useState(null)
    // const checkboxChecked2 = []
    const [checkboxChecked2, setCheckboxChecked2] = useState([])
    let newCId = null;
    const [newCIdd, setNewCIdd] = useState(null)
    const [showPhotosEquip1, setShowPhotosEquip1] = useState(false)
    const [photosEquip1,setPhotosEquip1] = useState([])
    const [showPhotosEquip2, setShowPhotosEquip2] = useState(false)
    const [photosEquip2,setPhotosEquip2] = useState([])
    const [showPhotosEquip3, setShowPhotosEquip3] = useState(false)
    const [photosEquip3,setPhotosEquip3] = useState([])
    const [showPhotosEquip4, setShowPhotosEquip4] = useState(false)
    const [photosEquip4,setPhotosEquip4] = useState([])
    const [showPhotosEquip5, setShowPhotosEquip5] = useState(false)
    const [photosEquip5,setPhotosEquip5] = useState([])
    const [showPhotosEquip6, setShowPhotosEquip6] = useState(false)
    const [photosEquip6,setPhotosEquip6] = useState([])
    const [showPhotosEquip7, setShowPhotosEquip7] = useState(false)
    const [photosEquip7,setPhotosEquip7] = useState([])
    const [showPhotosEquip8, setShowPhotosEquip8] = useState(false)
    const [photosEquip8,setPhotosEquip8] = useState([])
    const [showPhotosEquip9, setShowPhotosEquip9] = useState(false)
    const [photosEquip9,setPhotosEquip9] = useState([])

    // const handleEquipementPhotos = (i, event) => {
    //     const filesArray = Array.from(event.target.files).map(file => URL.createObjectURL(file))
    //     setEquipements(prev => prev.map((equip, index) => index === i ? {...equip, photos: filesArray} : equip))
    // }
    
    const handleCheckboxChange = (i, e) => {
        // e.preventDefault()
        setEquipements(prev => prev.map((equip, index) => index === i ? {...equip, showPhotos: !equip.showPhotos} : equip));
        // console.log('E.TARGET :')
        // console.log(e.target.id)
        if (e.target.checked) {
            setNewCheckboxChecked(prev => [...prev, e.target.id])
        } else {
            setNewCheckboxChecked(prev => prev.filter(id => id !== e.target.id))
        }
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

    const handleEquipementPhotos = (i, e) => {
        e.preventDefault()
        // console.log('CHANGEMENT DES PHOTOS DE L\'EQUIPEMENT ...')
        // console.log(e.target)
        const divId = e.target.id
        const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file))
        setEquipements(prev => prev.map((equip, index) => index === i ? {...equip, photos: filesArray} : equip))
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file)=>{
                return URL.createObjectURL(file)
            })
            switch (divId) {
                case '1':
                    setPhotosEquip1([])
                    setPhotosEquip1(prev => prev.concat(filesArray))
                    break
                case '2':
                    setPhotosEquip2([])
                    setPhotosEquip2(prev => prev.concat(filesArray))
                    break
                case '3':
                    setPhotosEquip3([])
                    setPhotosEquip3(prev => prev.concat(filesArray))
                    break
                case '4':
                    setPhotosEquip4([])
                    setPhotosEquip4(prev => prev.concat(filesArray))
                    break
                case '5':
                    setPhotosEquip5([])
                    setPhotosEquip5(prev => prev.concat(filesArray))
                    break
                case '6':
                    setPhotosEquip6([])
                    setPhotosEquip6(prev => prev.concat(filesArray))
                    break
                case '7':
                    setPhotosEquip7([])
                    setPhotosEquip7(prev => prev.concat(filesArray))
                    break
                case '8':
                    setPhotosEquip8([])
                    setPhotosEquip8(prev => prev.concat(filesArray))
                    break
                case '9':
                    setPhotosEquip9([])
                    setPhotosEquip9(prev => prev.concat(filesArray))
                    break
                default:
                    break
            }
            Array.from(e.target.files).map(file => {
                return URL.revokeObjectURL(file)
            })
        }
        // const files = Array.from(e.target.files)
        // console.log('files =')
        // console.log(files)
    }

    const handleCheckboxChange2 = (e) => {
        const isChecked = e.target.checked
        const cId = e.target.id
        const num = cId.split('-')[1]
        index = Number(cId.split('-')[1])-1 
        newCId = num
        setNewCIdd(num)
        if (isChecked) {
            // checkboxChecked2.push(cId)
            // console.log(checkboxChecked2)
            // console.log(newCId)
            // console.log(num)
            setCheckboxChecked2(prev => [...prev, cId])
        } else {
            // const i = checkboxChecked2.indexOf(cId)
            // if (i > -1) {
            //     checkboxChecked2.splice(i, 1)
            // }
            // console.log(newCId)
            // console.log(num)
            // console.log(checkboxChecked2)
            setCheckboxChecked2(prev => prev.filter(id => id !== cId))
        }
        // setShowPhotosEquip(prev => {
        //     const newShowPhotos = [...prev]
        //     newShowPhotos[index] = isChecked
        //     return newShowPhotos
        // })
        switch (num) {
            case '1':
                setShowPhotosEquip1(prev => !prev)
                break
            case '2':
                setShowPhotosEquip2(prev => !prev)
                break
            case '3':
                setShowPhotosEquip3(prev => !prev)
                break
            case '4':
                setShowPhotosEquip4(prev => !prev)
                break
            case '5':
                setShowPhotosEquip5(prev => !prev)
                break
            case '6':
                setShowPhotosEquip6(prev => !prev)
                break
            case '7':
                setShowPhotosEquip7(prev => !prev)
                break
            case '8':
                setShowPhotosEquip8(prev => !prev)
                break
            case '9':
                setShowPhotosEquip9(prev => !prev)
                break
            default:
                break
        }
        // setShowPhotosEquip1(prev => !prev)
    }

    useEffect(()=>{
        // console.log('changement showPhotosEquip')
        // console.log(showPhotosEquip)
    }, [showPhotosEquip])

    useEffect(()=>{
        // console.log('changement checkboxChecked2')
        // console.log(checkboxChecked2)
    }, [checkboxChecked2])

    useEffect(()=>{
        // console.log('changement newCheckboxChecked')
        // console.log(newCheckboxChecked)
        const newT = {...t, equipements: newCheckboxChecked.join('|')}
        props.updateTerrain(newT)
    }, [newCheckboxChecked])

    useEffect(()=>{
        // console.log('changement equipement')
        // console.log(equipements)
    }, [equipements])

    return (
    <div>
        <h3>
            Equipements disponibles
        </h3>
        <div className="row text-center">
            {
                loading && (
                    <div>
                        CHARGEMENT DES DONNEES ...
                    </div>
                )
            }
            {
                !loading && equipements.map((equip, i) => {
                    return (
                    <div className="col-12 col-sm-6 col-md-4" key={equip.id}>
                        <ul className="list-group mb-3">
                            <li className="list-group-item">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input me-1" 
                                    // id={`equipement-${i}`}
                                    id={`equipement-${equip.id}`}
                                    // checked={newCheckboxChecked.includes(`equipement-${i}`)}
                                    checked={newCheckboxChecked.includes(`equipement-${equip.id}`)}
                                    // onChange={handleCheckboxChange2}
                                    onChange={(e)=>handleCheckboxChange(i, e)}
                                />
                                <label 
                                    // htmlFor={`equipement-${i}`} 
                                    htmlFor={`equipement-${equip.id}`} 
                                    className="form-check-label stretched-link"
                                >
                                    {equip.nom}
                                </label>
                            </li>
                        </ul>
                    </div>
                    )
                })
            }
            {/* <div className="col-12 col-sm-6 col-md-4">
                <ul className="list-group mb-3">
                    <li className="list-group-item firstItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="1" 
                            id="equipement-1"
                            onChange={handleCheckboxChange2} 
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-1"
                        >
                            Douche
                        </label>
                    </li>
                        {
                            showPhotosEquip1 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip1)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="4" 
                            id="equipement-2"
                            onChange={handleCheckboxChange2} 
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-2"
                        >
                            Electricité
                        </label>
                    </li>
                        {
                            showPhotosEquip2 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip2)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item lastItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="7" 
                            id="equipement-3" 
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-3"
                        >
                            Piscine
                        </label>
                    </li>
                        {
                            showPhotosEquip3 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip3)}
                                </div>
                                </>
                            )
                        }
                </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
                <ul className="list-group mb-3">
                    <li className="list-group-item firstItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="2" 
                            id="equipement-4" 
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-4"
                        >
                            WC
                        </label>
                    </li>
                        {
                            showPhotosEquip4 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip4)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="5" 
                            id="equipement-5" 
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-5"
                        >
                            Cuisine
                        </label>
                    </li>
                        {
                            showPhotosEquip5 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip5)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item lastItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="8" 
                            id="equipement-6" 
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-6"
                        >
                            Eau potable
                        </label>
                    </li>
                        {
                            showPhotosEquip6 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip6)}
                                </div>
                                </>
                            )
                        }
                </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
                <ul className="list-group">
                    <li className="list-group-item firstItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="3" 
                            id="equipement-7" 
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-7"
                        >
                            Wifi
                        </label>
                    </li>
                        {
                            showPhotosEquip7 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip7)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="6" 
                            id="equipement-8"
                            onChange={handleCheckboxChange2} 
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-8"
                        >
                            Barbecue
                        </label>
                    </li>
                        {
                            showPhotosEquip8 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip8)}
                                </div>
                                </>
                            )
                        }
                    <li className="list-group-item lastItem">
                        <input 
                            className="form-check-input me-1" 
                            type="checkbox" 
                            // value="9" 
                            id="equipement-9"
                            onChange={handleCheckboxChange2}
                        />
                        <label 
                            className="form-check-label stretched-link" 
                            htmlFor="equipement-9"
                        >
                            Autre
                        </label>
                    </li>
                        {
                            showPhotosEquip9 && (<>
                                <EquipementPhotos
                                    classNameComp={'my-3'}
                                    classNameInput={'my-3'}
                                    id={newCIdd}
                                    onChange={handleEquipementPhotos}
                                />
                                <div id={newCIdd}>
                                    {renderPhotos(photosEquip9)}
                                </div>
                                </>
                            )
                        }
                </ul>
            </div> */}
        </div>
    </div>
  )
}
