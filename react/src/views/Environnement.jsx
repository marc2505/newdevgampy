import React, { useEffect, useState } from 'react'

export default function Environnement(props) {

    const t = props.terrain
    const [key2, setKey2] = useState('radioCampagne')
    const [environnement, setEnvironnement] = useState('')
    const handleRadio = (e) => {
        setKey2(e.target.value)
        const newT = {...t, environnement: e.target.value}
        props.updateTerrain(newT)
    }

    useEffect(() => {
        if (t.id) {
            // Un id est présent
            setKey2(t.environnement)
        } else {
            // Pas d'id ...
        }
    }, [])
    

  return (
    <div>
        <h3>
            Environnement du terrain
        </h3>
        <div className="row text-center">
            <div className="col-12 col-sm-6 col-md-4">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioCampagne" 
                        checked={key2 === 'radioCampagne'} 
                        onChange={handleRadio}
                        value={'radioCampagne'}
                    />
                    <label className="form-check-label" htmlFor="radioCampagne">
                        Campagne
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioBdm" 
                        checked={key2 === 'radioBdm'} 
                        onChange={handleRadio}
                        value={'radioBdm'}
                    />
                    <label className="form-check-label" htmlFor="radioBdm">
                        Bord de mer
                    </label>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioMontagne" 
                        onChange={handleRadio}
                        checked={key2 === 'radioMontagne'} 
                        value={'radioMontagne'}
                    />
                    <label className="form-check-label" htmlFor="radioMontagne">
                        Montagne
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioForet" 
                        onChange={handleRadio}
                        checked={key2 === 'radioForet'} 
                        value={'radioForet'}
                    />
                    <label className="form-check-label" htmlFor="radioForet">
                        Forêt
                    </label>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioAgglo" 
                        onChange={handleRadio}
                        checked={key2 === 'radioAgglo'} 
                        value={'radioAgglo'}
                    />
                    <label className="form-check-label" htmlFor="radioAgglo">
                        Agglomération
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault2" 
                        id="radioAutre" 
                        onChange={handleRadio}
                        checked={key2 === 'radioAutre'} 
                        value={'radioAutre'}
                    />
                    <label className="form-check-label" htmlFor="radioAutre">
                        Autre ...
                    </label>
                </div>
            </div>
            <div>
            {
                key2 === 'radioAutre' && (
                    <div>
                        <div className='my-3' style={{ textAlign:'left' }}>Précisez l'environnement de votre terrain :</div>
                        <input 
                            type="text" 
                            className='form-control'
                            placeholder="Entrer l'environnement du terrain"
                            onChange={e=>setEnvironnement(e.target.value)}
                        />
                        <p style={{ color:'#25632d' }}>{environnement}</p>
                    </div>
                )
            }
            </div>
        </div>
    </div>
  )
}
