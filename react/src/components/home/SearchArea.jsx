import React, { useContext, useEffect, useRef, useState } from 'react'
import {BiSolidCalendar} from 'react-icons/bi'
import {LiaGlobeAmericasSolid} from 'react-icons/lia'
import {ImFilter} from 'react-icons/im'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Calendar from "react-calendar"
import format from 'date-fns/format'
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom'
import Terrains from '../../views/Terrains'
import { useSearchContext } from '../../contexts/ContextSearch'
import { isBefore, isEqual } from 'date-fns'
import { isAfter } from 'date-fns'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import axiosClient from '../../axios-client'
import RangeSlider from 'react-range-slider-input';
// import 'jquery-ui/dist/jquery-ui'

const libraries = ['places']

export default function SearchArea() {
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "ch" },
    fields: ["address_components", "formatted_address", "geometry", "icon", "name"],
    // types: ["establishment"]
  }
  const {isLoaded, loadError} = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_CLE_MAPS_API_2,
    libraries,
  })
  const {recherche, 
         setRecherche,
         dateDebut,
         setDateDebut,
         dateFin,
         setDateFin,
         filtre,
         setFiltre} = useSearchContext()
  const navigate = useNavigate()
  const [valueStart, setValueStart] = useState(new Date())
  let demain = new Date(valueStart)
  demain.setDate(demain.getDate()+1)
  const [dateDebutLocale, setDateDebutLocale] = useState(new Date())
  const [dateFinLocale, setDateFinLocale] = useState(demain)
  const [dateDebutLisible, setDateDebutLisible] = useState(new Date())
  const [dateFinLisible, setDateFinLisible] = useState(new Date())
  const [allowShow, setAllowShow] = useState(true)
  const [lieu, setLieu] = useState('vide')
  const [showFiltre, setShowFiltre] = useState(false)
  const [show, setShow] = useState(false)
  const [showModalDate, setShowModalDate] = useState(false)
  const [valueEnd, setValueEnd] = useState(demain)
  const [viewStart, setViewStart] = useState('month')
  const [viewEnd, setViewEnd] = useState('month')
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [rangeValue, setRangeValue] = useState([0, 100])
  const [selectedEnvironnement, setSelectedEnvironnement] = useState('')
  const [selectedEquipement, setSelectedEquipement] = useState([])
  const [selectedPrestations, setSelectedPrestations] = useState('')
  const [lstEnvironnement, setLstEnvironnement] = useState([])
  const [lstEquipement, setLstEquipement] = useState([])
  const [lstPrestations, setLstPrestations] = useState([])

  const getEquipements = async () => {
    setLoading(true)
    await axiosClient.get('/equipements')
    .then(({data}) => {
        setLstEquipement(data.data)
        setLoading(false)
        const environnements = [
            'Campagne',
            'Montagne',
            'Agglomération',
            'Bord de mer',
            'Forêt',
        ]
        setLstEnvironnement(environnements)
    })
    .catch((err) => {
        console.log(err)
    })
  }

  useEffect(()=>{
    getEquipements()
    if (!loading) {
        console.log('liste equipement => ')
        console.log(lstEquipement)
        console.log('liste environnement => ')
        console.log(lstEnvironnement)
    }
  }, [])
  
  const handleChangeValueStart = (e) => {
    setValueStart(e)
    setDateDebutLocale(e)
    setDateDebutLisible(format(e,'dd MMM yyyy'))
    if (isAfter(e,valueEnd)) {
        setValueEnd(e)
        setDateFinLocale(e)
        setDateFinLisible(format(e,'dd MMM yyyy'))
    }
  }

  const handleChangeValueEnd = (e) => {
    setValueEnd(e)
    setDateFinLocale(e)
    setDateFinLisible(format(e,'dd MMM yyyy'))
    if (isBefore(e, valueStart)) {
        setValueStart(e)
        setDateDebutLocale(e)
        setDateDebutLisible(format(e,'dd MMM yyyy'))
    }
  }

  const handleClose = () => {
    // document.getElementById('quand').blur()
    setShow(false)
    setAllowShow(false)
    // setTimeout(()=>{
    //     document.getElementById('quand').blur()
    // }, 0)
    
  }
  const handleShow = () => {
    if (allowShow) {
        setShow(true);
    } else {
        setAllowShow(true);
    }
  }
  const handleCloseModalDate = () => {
    setShowModalDate(false)
  }
  const handleShowModalDate = () => {
    setShowModalDate(true)
  }

  useEffect(()=>{
    if (!isLoaded) {
        return
    }
    const autoComplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
    )
    autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace()
        // console.log('PLACE =')
        // console.log(place)
        // const rueLong = place.address_components[1].long_name
        // const numero = place.address_components[0].short_name
        const formattedAddressArray = place.formatted_address.split(',')
        const addressComponent = place.address_components
        // addressComponent.length > 0 &&
        // addressComponent.map((obj,cle) => {
        //     console.log('object =')
        //     console.log(obj)
        // })
        // const rue = formattedAddressArray[0]
        // const ville = formattedAddressArray[1].trim().split(' ')[1]
        // const npa = formattedAddressArray[1].trim().split(' ')[0]
        // const pays = formattedAddressArray[2]
        // console.log(place)
        let t_adresse = ''
        let t_npa = ''
        let t_ville = ''
        let t_canton = ''
        let t_pays = ''
        for (let i=0; i<place.address_components.length; i++) {
            if (place.address_components[i].types.includes('route')) {
                t_adresse = place.address_components[i].long_name
            } else if (place.address_components[i].types.includes('locality')) {
                t_ville = place.address_components[i].long_name
            } else if (place.address_components[i].types.includes('administrative_area_level_1')) {
                t_canton = place.address_components[i].long_name
            } else if (place.address_components[i].types.includes('country')) {
                t_pays = place.address_components[i].long_name
            } else if (place.address_components[i].types.includes('postal_code')) {
                t_npa = place.address_components[i].long_name
            }
        }
        let newAdresse = t_adresse+' '+t_ville+' '+t_npa+' '+t_canton+' '+t_pays
        // console.log('NEWADRESSE =')
        // console.log(newAdresse.split(' ').filter(Boolean))
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        // setLieu(t_ville)
        setLieu(t_canton)
        setRecherche(t_canton)
    })
  }, [isLoaded])

  const searchLocation = (ev) => {
    ev.preventDefault()
    setRecherche(lieu)
    if (dateDebut == null && dateFin == null) {
        setDateDebut(format(valueStart, 'dd MMM yyyy'))
        setDateFin(format(valueEnd, 'dd MMM yyyy'))
    }
    navigate('/terrains')
  }

  const searchDate = (ev) => {
    ev.preventDefault()
    if (recherche == null) {
        setRecherche('vide')
    }
    setDateDebut(format(dateDebutLocale, 'dd MMM yyyy'))
    setDateFin(format(dateFinLocale, 'dd MMM yyyy'))
    navigate('/terrains')
  }

  const searchFilter = (ev) => {
    ev.preventDefault()
    setShowFiltre(current => !current)
  }

  const enregistrerLaDate = (ev) => {
    ev.preventDefault()
    if (isBefore(dateFinLocale, dateDebutLocale)) {
        alert('Erreur dans la sélection de dates ...')
    } else {
        quand.value = 'Du '+format(dateDebutLocale, 'dd MMM yyyy')+' au '+format(dateFinLocale, 'dd MMM yyyy')
        
        setDateDebut(format(dateDebutLocale, 'dd MMM yyyy'))
        setDateFin(format(dateFinLocale, 'dd MMM yyyy'))
        if (format(dateDebutLocale, 'dd MMM yyyy') == format(dateFinLocale, 'dd MMM yyyy')) {
            // alert('Erreur dans les dates ...')
            handleClose()
            handleShowModalDate()
            handleShow()
            return
        }
        // navigate('/terrains')
        handleClose()
    }
  }

  const handleEnvironnementChange = (e) => {
    setSelectedEnvironnement(e.target.value)
    // setFiltre(prevFiltre => ({
    //     ...prevFiltre,
    //     environnement: e.target.value
    // }))
  }

  const handleEquipementChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
        // Si la case est cochée, ajoutez la valeur à l'état
        setSelectedEquipement(prev => [...prev, value]);
    } else {
        // Sinon, supprimez la valeur de l'état
        setSelectedEquipement(prev => prev.filter(item => item !== value));
    }
  }

  useEffect(()=>{
    setFiltre(prevFiltre=>({
        ...prevFiltre,
        equipements: selectedEquipement,
        prix: selectedPrice,
        environnement: selectedEnvironnement
    }))
  }, [selectedEquipement, selectedPrice, selectedEnvironnement])

  useEffect(()=>{
    console.log('CHANGEMENT AU NIVEAU DU FILTRE :')
    console.log(filtre)
  }, [filtre])


  return (
    <div className='py-5 poppins' style={{ background: '' }}>
      <div className='container'>
        <div className="row" style={{ height:'60px' }}>
            <div className="col-md-12">
                <div className="input-group mb-3" style={{ height:'100%', border:'', borderRadius:'5px' }}>
                    <input 
                        type="text" 
                        className="form-control sansOutline" 
                        aria-label="Place" 
                        placeholder='Où souhaitez-vous partir ?'
                        id='ou'
                        tabIndex={1}
                        ref={inputRef}
                    />
                    <button 
                        className="input-group-text cursorPointer customFocus" 
                        tabIndex={2}
                        onClick={searchLocation}
                        style={{ margin:'0', marginRight:'1px', outline:'none'}}
                    >
                        <LiaGlobeAmericasSolid id='search-icon'/>
                    </button>
                    <input 
                        type="text" 
                        className="form-control sansOutline" 
                        aria-label="Date" 
                        placeholder='Quand souhaitez-vous partir ?' 
                        id='quand'
                        tabIndex={3}
                        onClick={handleShow} 
                        onFocus={handleShow}
                    />
                    <button 
                        className="input-group-text cursorPointer customFocus" 
                        onClick={searchDate} 
                        tabIndex={4}
                        style={{ margin:'0', marginRight:'1px', outline:'none' }}
                    >
                        <BiSolidCalendar id='date-icon'/>
                    </button>
                    <button 
                        className="input-group-text cursorPointer customFocus" 
                        onClick={searchFilter}
                        tabIndex={5}
                        style={{ outline: 'none' }}
                    >
                        <ImFilter id='filter-icon'/>
                    </button>
                </div>
            </div>
        </div>
      
      {
        showFiltre && (
            <>
            <div className="row">
                <div className="col-md-12">
                    <h3>Plus de filtres</h3>
                </div>
            </div>

            <div className="row bg-gray">
                <div className="col-md-12">
                    <select 
                        className='form-control' 
                        id="filtre"
                        value={selectedFilter}
                        onChange={e => setSelectedFilter(e.target.value)}
                    >
                        <option>Choisir un filtre</option>
                        <option>Prix / nuitée</option>
                        <option>Environnement</option>
                        <option>Equipement</option>
                        {/* <option>Prestations</option> */}
                    </select>
                </div>
            </div>



            {selectedFilter === "Prix / nuitée" && (
                <div style={{ background: 'white', borderRadius:'5px', paddingBottom: '30px' }} className='mt-3'>
                    <h3>Choisir un prix : {selectedPrice}</h3>

                    <RangeSlider
                        className="single-thumb"
                        min={0}
                        max={100}
                        value={[0, selectedPrice]}
                        thumbsDisabled={[true, false]}
                        rangeSlideDisabled={true}
                        onInput={values => {
                            const [debut, fin] = values
                            setSelectedPrice(fin)
                            // setFiltre(prevFiltre => ({
                            //     ...prevFiltre,
                            //     prix: fin
                            // }))
                            // setRangeValue(values)
                        }}
                    />

                </div>
            )}

            {selectedFilter === "Environnement" && (
                <div style={{ background: 'white', borderRadius:'5px' }} className='mt-3'>
                    <h3>Choisir un environnement</h3>
                    {
                        !loading && lstEnvironnement && lstEnvironnement.map((e, idx) => {
                            return (
                                <div key={idx} className='form-check text-center' style={{ width: '50%', margin:'auto' }}>
                                    <input 
                                        type="radio" 
                                        id={`checkbox-${idx}`} 
                                        name='environnement' 
                                        value={e} 
                                        className='form-check-input'
                                        onChange={handleEnvironnementChange}
                                        checked={selectedEnvironnement === e}
                                    />
                                    <label htmlFor={`checkbox-${idx}`} className='form-check-label'>{e}</label>
                                </div>
                            )
                        })
                    }
                </div>
            )}

            {selectedFilter === "Equipement" && (
                <div style={{ background: 'white', borderRadius:'5px' }} className='mt-3'>
                    <h3 className='text-center'>Choisir un équipement</h3>
                    <br />
                    {
                        !loading && lstEquipement && lstEquipement.map(equip => {
                            return (
                                <div key={equip.id} className='form-check text-center' style={{ width: '50%', margin:'auto' }}>
                                    <div className="">
                                        <input 
                                            type="checkbox" 
                                            id={`checkbox-${equip.id}`} 
                                            value={equip.nom} 
                                            className='form-check-input'
                                            onChange={handleEquipementChange}
                                            checked={selectedEquipement.includes(equip.nom)}
                                        />
                                        <label htmlFor={`checkbox-${equip.id}`} className='form-check-label'>{equip.nom}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )}

            {/* {selectedFilter === "Prestations" && (
                <div style={{ background: 'white', borderRadius:'5px' }} className='mt-3'>
                    <h3>Choisir une prestation</h3>

                </div>
            )} */}

            </>
        )
      }

      <Modal
        show={showModalDate}
        onHide={handleCloseModalDate}
        backdrop="static"
        keyboard={false}
        size=''
      >
        <Modal.Header closeButton style={{background:'grey', color:'white'}}>
          <Modal.Title>Erreur dans le choix des dates</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{background:'grey', color:'white'}}>
            <Container>
                <Row>
                    <Col>
                        Vous devez choisir une nuit au minimum ...
                    </Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer style={{background:'grey', color:'white'}}>
          <Button variant="primary" onClick={handleCloseModalDate}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
      >
        <Modal.Header closeButton>
          <Modal.Title>Choix des dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container fluid>
                <Row>
                    <Col className='col-12 col-sm-12 col-md-6'>
                        <h5 className='text-center'>Date de début : {valueStart && format(valueStart, 'dd-MMM-yyyy')}</h5>
                        <div className="d-flex justify-content-center mb-2">
                            <Calendar 
                                key={valueStart}
                                value={valueStart}
                                className={'mx-auto'}
                                style={{ pointerEvents: "none" }}
                                onChange={handleChangeValueStart}
                                onViewChange={view => setViewStart(view)}
                                view={viewStart}
                                minDate={new Date()}
                            />
                        </div>
                    </Col>
                    <Col className='col-12 col-sm-12 col-md-6'>
                        <h5 className='text-center'>Date de fin : {valueEnd && format(valueEnd, 'dd-MMM-yyyy')}</h5>
                        <div className="d-flex justify-content-center mb-2">
                            <Calendar 
                                key={valueEnd}
                                value={valueEnd}
                                className={'mx-auto'}
                                style={{ pointerEvents: "none" }}
                                onChange={handleChangeValueEnd}
                                onViewChange={view => setViewEnd(view)}
                                view={viewEnd}
                                // minDate={demain}
                                minDate={new Date()}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={enregistrerLaDate}>Choisir</Button>
        </Modal.Footer>
      </Modal>

      </div>
    </div>
  )
}
