import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LuTent } from 'react-icons/lu'

const libraries = ['places']

export default function AdresseTerrain(props) {
    const t = props.terrain
    const mapRef = useRef()
    const inputRef = useRef()
    const center = {
        lat: 46.232930,
        lng: 6.077800
    }
    const [mapCenter, setMapCenter] = useState(center)
    const [loading, setLoading] = useState(true)
    const [marqueurs, setMarqueurs] = useState([])
    const [pos, setPos] = useState(null)
    const [titre, setTitre] = useState('')
    const [adresse, setAdresse] = useState('')
    const [ville, setVille] = useState('')
    const [npa, setNpa] = useState('')
    const [pays, setPays] = useState('')
    const [formattedAddress, setFormattedAddress] = useState('')
    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_CLE_MAPS_API_2,
        libraries,
    })
    const options = {
        componentRestrictions: { country: "ch" },
        fields: ["address_components", "formatted_address", "geometry", "icon", "name"],
    }
    
    const fetchAddress = async (lat, lng) => {
        if (!isLoaded) return
        const apiKey = import.meta.env.VITE_CLE_MAPS_API_2;  // Replace with your actual API key
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)
        const data = await response.json();
    
        if (data.results && data.results.length > 0) {
            const address = data.results[0];
            // Filtering the address components to extract the necessary fields
            const street_number = address.address_components.find(component => component.types.includes("street_number"))?.long_name
            const city = address.address_components.find(component => component.types.includes("locality"))?.long_name
            const route = address.address_components.find(component => component.types.includes("route"))?.long_name
            const postal_code = address.address_components.find(component => component.types.includes("postal_code"))?.long_name
            const country = address.address_components.find(component => component.types.includes("country"))?.long_name
            // Joining street number and route to form the complete street address
            const street = `${street_number} ${route}`
            // console.log('ADDRESS :')
            // console.log(address)
            setAdresse(street)
            setVille(city)
            setNpa(postal_code)
            setPays(country)
    
            return { street, postal_code, city, country, route }
        } else {
            return null
        }
    }
    const fetchCoordinates = async (address) => {
        if (!isLoaded) return
        let lat = 0
        let lng = 0
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                setPos({ lat, lng });
                fetchAddress(lat, lng);
                const newM = new google.maps.Marker({
                    position: {lat:lat, lng:lng},
                    map: mapRef.current,
                    title: address
                })
                newM.addListener('click', handleMarkerClick(newM))
                // marqueurs.push(newM)
                setMarqueurs(prev => [...prev, newM])
                setMapCenter({lat, lng})
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        })
        return {lat: lat, lng: lng}
    }
    const handleMarkerClick = (marker) => {
        return function (e) {
            const index = marqueurs.indexOf(marker)
            if (index !== -1) {
                marqueurs.splice(index, 1)
            }
            setMarqueurs(marqueurs.filter(m=>m.position!==marker.position))
            marker.setMap(null)
        }
    }
    const Map = () => {
        const onMapLoad = useCallback((map)=>{
            mapRef.current = map
            marqueurs.forEach(m => {
                const newM = new google.maps.Marker({
                    position: m.position,
                    map,
                    title: m.title
                })
                newM.addListener('click', handleMarkerClick(newM))
            })
        }, [marqueurs])

        return <GoogleMap 
            zoom={17}
            center={mapCenter}
            onLoad={onMapLoad}
            mapContainerClassName='map-container'
        ></GoogleMap>
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
            let t_adresse = ''
            let t_no_rue = ''
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
                } else if (place.address_components[i].types.includes('street_number')) {
                    t_no_rue = place.address_components[i].long_name
                }
            }
            let newAdresse = t_adresse+' '+t_no_rue+', '+t_npa+' '+t_ville+', '+t_canton+', '+t_pays
            document.getElementById('rue').value = t_adresse+' '+t_no_rue
            document.getElementById('ville').value = t_ville
            document.getElementById('npa').value = t_npa
            document.getElementById('pays').value = t_pays
            document.getElementById('canton').value = t_canton
            
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            const marqueur = new window.google.maps.Marker({
                position: {lat, lng},
                map: mapRef.current,
                title: place.name
            })
            setMarqueurs(prev => [marqueur])
            setFormattedAddress(newAdresse)
            setMapCenter({lat, lng})
        })

        if (t && t.adresse) {
            fetchCoordinates(t.adresse)
            .then(({lat, lng}) => {
                if (mapRef.current) {
                    const marqueur = new window.google.maps.Marker({
                        position: {lat, lng},
                        map: mapRef.current,
                        title: t.adresse
                    })
                    setMarqueurs(prev => [...prev, marqueur])
                }
                const rue = t.adresse.split(',')[0]
                const ville = t.adresse.split(',')[1].trim().split(' ')[1]
                const npa = t.adresse.split(',')[1].trim().split(' ')[0]
                const canton = t.adresse.split(',')[2]
                const pays = t.adresse.split(',')[3]
                document.getElementById('rue').value = rue
                document.getElementById('ville').value = ville
                document.getElementById('npa').value = npa
                document.getElementById('pays').value = pays
                document.getElementById('canton').value = canton
            })
            .catch((err) => {
                console.log(err)
            })
        }

    }, [isLoaded])

    useEffect(()=>{
        if (formattedAddress == '') return
        const newT = {...t, adresse: formattedAddress}
        props.updateTerrain(newT)
    }, [formattedAddress])

    return (
    <div className='mt-4'>
        <div className="container-fluid">
            <div className="row">
                <h5><LuTent style={{ fontSize:'25px',color:'red', marginRight:'10px' }} />Renseignez l'adresse du terrain</h5>
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
                    <div className="">
                        <label htmlFor="rue" className="form-label">Rue</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="rue" 
                            ref={inputRef}
                        />
                    </div>
                    <div className="">
                        <label htmlFor="npa" className="form-label">Code postal (NPA)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="npa" 
                            disabled 
                        />
                    </div>
                    <div className="">
                        <label htmlFor="ville" className="form-label">Ville</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="ville" 
                            disabled 
                        />
                    </div>
                    <div className="">
                        <label htmlFor="canton" className="form-label">Canton</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="canton" 
                            disabled 
                        />
                    </div>
                    <div className="">
                        <label htmlFor="pays" className="form-label">Pays</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="pays" 
                            disabled 
                        />
                    </div>
                </div>
            </div>
            <div className="my-4">
                {
                    isLoaded && <Map />
                }
            </div>

        </div>
    </div>
  )
}
