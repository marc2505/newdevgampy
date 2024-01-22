import React, { useEffect, useState } from 'react'

export default function NombreVisiteurs(props) {

    const t = props.terrain
    const [selectedValue, setSelectedValue] = useState('')
    const [surfaceValue, setSurfaceValue] = useState('')

    const handleSurface = (e) => {
        e.preventDefault()
        setSurfaceValue(e.target.value)
        const newT = {...t, surface: parseInt(e.target.value)}
        props.updateTerrain(newT)
    }

    const handleNbrGampeurs = (e) => {
        e.preventDefault()
        setSelectedValue(e.target.value)
        const newT = {...t, capacite_visiteurs: parseInt(e.target.value)}
        props.updateTerrain(newT)
    }

    useEffect(()=>{
        if (t.id) {
            // Un id est présent
            setSelectedValue(t.capacite_visiteurs)
            setSurfaceValue(t.surface)
        } else {
            // Pas d'id ...
        }
    }, [])

  return (
    <div>
        <div className="row">
            <div className="col-12 col-md-6">
                <h2>Nbr max de gampeurs / réservation</h2>
                <div>
                    <div className="form-floating">
                        <select 
                            className="form-select" 
                            onChange={handleNbrGampeurs}
                            id="floatingSelect2"
                            value={selectedValue}
                        >
                            <option defaultValue>Choisir un nombre</option>
                            <option value="1">1 visiteur</option>
                            <option value="2">2 visiteurs</option>
                            <option value="3">3 visiteurs</option>
                            <option value="4">4 visiteurs</option>
                            <option value="5">5 visiteurs</option>
                            <option value="6">6 visiteurs</option>
                            <option value="7">7 visiteurs</option>
                            <option value="8">8 visiteurs</option>
                            <option value="9">9 visiteurs</option>
                            <option value="10">10 visiteurs</option>
                            <option value="11">11 visiteurs</option>
                            <option value="12">12 visiteurs</option>
                            <option value="13">13 visiteurs</option>
                            <option value="14">14 visiteurs</option>
                            <option value="15">15 visiteurs</option>
                        </select>
                        <label htmlFor="floatingSelect2">Choix du nombre maximum de visiteurs</label>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <h2>Surface du terrain</h2>
                <div style={{ height:'58px' }}>
                    <input 
                        className='form-control'
                        id='surface'
                        min={'0'}
                        value={surfaceValue}
                        onChange={handleSurface}
                        placeholder='Entrer la surface du terrain (m2)'
                        type="number" 
                    />
                </div>
            </div>
        </div>
    </div>
  )
}
