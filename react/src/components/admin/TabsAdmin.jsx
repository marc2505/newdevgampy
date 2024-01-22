import React, { useCallback, useEffect, useRef, useState } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axiosClient from '../../axios-client'
import Annonces from '../../views/Annonce'
import DataTableUsers from './DataTableUsers'
import UserFormCreate from './UserFormCreate'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {GoogleMap, useJsApiLoader} from '@react-google-maps/api'
import DataTableEquipements from './DataTableEquipements'
import EquipementFormCreate from './EquipementFormCreate'
import DataTablePrestations from './DataTablePrestations'
import PrestationFormCreate from './PrestationFormCreate'
import DataTableAnnonces from './DataTableAnnonces'
import DataTableReservations from './DataTableReservations'

const libraries = ['places']

export default function TabsAdmin() {

  const [activeTab, setActiveTab] = useState('first')
  const handleTabSelect = (tab) => {
    setActiveTab(tab)
  }
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(null)
  const [key, setKey] = useState('liste')
  const [keyTab2, setKeyTab2] = useState('liste')
  const [keyTab3, setKeyTab3] = useState('liste')
  const [keyTab4, setKeyTab4] = useState('liste')
  const [keyTab5, setKeyTab5] = useState('liste')
  const [marqueurs, setMarqueurs] = useState([])
  const [show, setShow] = useState(false)
  const [map, setMap] = useState(null)
  const [titre, setTitre] = useState('')
  const [pos, setPos] = useState(null)
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [npa, setNpa] = useState('')
  const [pays, setPays] = useState('')
  const mapRef = useRef()
  const [inputAddress, setInputAddress] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const {isLoaded, loadError} = useJsApiLoader({
    // id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_CLE_MAPS_API_2,
    libraries,
  })
  
  const center = {
    lat: 46.232930,
    lng: 6.077800
  }

  const ajouterTitre = () => {
    const marqueur = marqueurs.find(m => m.position == pos)
    if (!marqueur) {
        setMarqueurs(markers => [...markers, {position: pos, title: titre}])
    }
    handleClose()
  }

  const fetchAddress = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_CLE_MAPS_API_2;  // Replace with your actual API key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const address = data.results[0];
        
        // Filtering the address components to extract the necessary fields
        const street_number = address.address_components.find(component => component.types.includes("street_number"))?.long_name;
        const city = address.address_components.find(component => component.types.includes("locality"))?.long_name;
        const route = address.address_components.find(component => component.types.includes("route"))?.long_name;
        const postal_code = address.address_components.find(component => component.types.includes("postal_code"))?.long_name;
        const country = address.address_components.find(component => component.types.includes("country"))?.long_name;
        // Joining street number and route to form the complete street address
        const street = `${street_number} ${route}`;

        setAdresse(street)
        setVille(city)
        setNpa(postal_code)
        setPays(country)

        return { street, postal_code, city, country, route };  // Modify or add to this object to suit your needs
    } else {
        return null;
    }
  }

  const fetchCoordinates = async (address) => {
    const geocoder = new google.maps.Geocoder();
    alert('ici')
    console.log('ADDRESS = ')
    console.log(address)
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            // console.log('RESULTS = ')
            // console.log(results)
            // console.log('LAT =')
            // console.log(lat)
            // console.log('LNG =')
            // console.log(lng)
            setPos({ lat, lng });
            fetchAddress(lat, lng);
            // console.log('POS =')
            // console.log(pos)
            // ajouter un marqueur ici
            const newM = new google.maps.Marker({
                position: {lat:lat, lng:lng},
                map: mapRef.current,
                title: 'Nouveau terrain'
            })
            newM.addListener('click', handleMarkerClick(newM))

            marqueurs.push(newM)

            handleClose();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    })
  }

  const handleMarkerClick = (marker) => {
    return function (e) {
        alert(`click on marker ${marker.getTitle()}`)
        console.log(e)
        const index = marqueurs.indexOf(marker)
        if (index !== -1) {
            marqueurs.splice(index, 1)
        }
        setMarqueurs(marqueurs.filter(m=>m.position!==marker.position))
        marker.setMap(null)
        console.log('MARQUEURS = ')
        console.log(marqueurs)
    }
}

  const Map = () => {

    // const handleMarkerClick = (marker) => {
    //     return function (e) {
    //         alert(`click on marker ${marker.getTitle()}`)
    //         console.log(e)
    //         const index = marqueurs.indexOf(marker)
    //         if (index !== -1) {
    //             marqueurs.splice(index, 1)
    //         }
    //         setMarqueurs(marqueurs.filter(m=>m.position!==marker.position))
    //         marker.setMap(null)
    //         console.log('MARQUEURS = ')
    //         console.log(marqueurs)
    //     }
    // }

    const onMapLoad = useCallback((map)=>{
        mapRef.current = map
        console.log('ONMAPLOAD :')
        console.log('MARQUEURS = ')
        console.log(marqueurs)

        // const markerThomas = new google.maps.Marker({
        //     position: {lat: 46.233705, lng: 6.080612},
        //     map,
        //     title: 'Chez Thomas !'
        // })

        // markerThomas.addListener('click', handleMarkerClick(markerThomas))

        // const markerMarc = new google.maps.Marker({
        //     position: {lat: 46.231360, lng: 6.074057},
        //     map,
        //     title: 'Chez Marc !'
        // })

        // markerMarc.addListener('click', handleMarkerClick(markerMarc))

        map.addListener('click', async (e)=>{
            // alert('click sur la map ...')
            // setPos(e.latLng)
            handleShow()
            // const address = await fetchAddress(e.latLng.lat(), e.latLng.lng());
        
            // if (address) {
            //     // console.log(address)
            //     console.log(`Street: ${address.street}, Postal Code: ${address.postal_code}, City: ${address.city }, Country: ${address.country}`);
            //     // Store the address wherever necessary
            // }
        })
        
        marqueurs.forEach(m => {
            const newM = new google.maps.Marker({
                position: m.position,
                map,
                title: m.title
            })
            newM.addListener('click', handleMarkerClick(newM))
        })

      }, [])

    return <GoogleMap 
        zoom={17}
        center={center}
        onLoad={onMapLoad}
        mapContainerClassName='map-container'
    >
        {/* {mapRef.current && <Marker position={{ lat: 46.23, lng: 6.07 }} title='Test' />} */}
        {/* {pos && <Marker position={pos} title={titre} />} */}
    </GoogleMap>
  }

  useEffect(()=>{
    getUsers()
  }, [])

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
    .then(({data})=>{
      setLoading(false)
      setUsers(data.data)
    })
    .catch((err)=>{
      setLoading(false)
      console.log(err)
    })
  }

  const onDelete = (ev) => {
    ev.preventDefault()
    alert('supprimer ...')
  }

  const handleClick = (ev) => {
    ev.preventDefault()
    // setIsShown((current)=>{return !current})
    // setIsShown(current=>!current)
  }

  return (
    <div style={{ display: 'block', width: '100%', padding: 30, minHeight: '380px'}} className='tabsWrapper'>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="first" fill className='customLink'>
        <Tab eventKey="first" title="Utilisateurs">
          {activeTab === 'first' && (
          <div>
            {
                key === 'liste' ?
                <DataTableUsers />
                :
                <UserFormCreate />
            }
          </div>
          )}
        </Tab>
        <Tab eventKey="second" title="Equipements">
          {activeTab === 'second' && (
            <div>
                {
                    keyTab2 === 'liste' ?
                    <DataTableEquipements />
                    :
                    <EquipementFormCreate />
                }
            </div>          
          )}
        </Tab>
        <Tab eventKey="third" title="Prestations">
          {activeTab === 'third' && (
            <div>
                {
                    keyTab3 === 'liste' ?
                    <DataTablePrestations />
                    :
                    <PrestationFormCreate />
                }
            </div>
          )}
        </Tab>
        <Tab eventKey="fourth" title="Annonces">
          {activeTab === 'fourth' && (
            <div>
                {
                    keyTab4 === 'liste' ?
                    <DataTableAnnonces />
                    :
                    <Annonces />
                }
            </div>
          )}
        </Tab>
        <Tab eventKey="fifth" title="Réservations">
          {activeTab === 'fifth' && (
            <div>
                {
                    keyTab5 === 'liste' ?
                    <DataTableReservations />
                    :
                    <h1>Création d'une réservation ...</h1>
                }
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  )
}