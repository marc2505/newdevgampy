import React, { useEffect, useRef, useState } from 'react'
import {PiTentFill, PiVanFill} from 'react-icons/pi'
import {FaCaravan} from 'react-icons/fa'
import {TbCamper} from 'react-icons/tb'

export default function TypeHebergement(props) {
  const [key, setKey] = useState('radioSansHebergement')
  const [selectedOption, setSelectedOption] = useState('')
//   const checkboxChecked = []
  //   const [typeHebergementString, setTypeHebergementString] = useState('radioSansHebergement')
//   let typeHebergementString = 'radioSansHebergement'
  const [typeHebergement, setTypeHebergement] = useState('')
  //   const checkboxChecked = useRef([])
  const [checkboxChecked, setCheckboxChecked] = useState([])

  const t = props.terrain
  //   const [newT, setNewT] = useState({})


  const handleCheckboxChange = (e) => {
    // e.preventDefault()
    const isChecked = e.target.checked
    // console.log(e)
    // console.log('isChecked='+isChecked)
    const cId = e.target.id
    // alert('ok')
    // console.log('cId =')
    // console.log(cId)
    if (isChecked) {
        // checkboxChecked.push(cId)
        // if (!checkboxChecked.includes(cId)) {
        //     setCheckboxChecked((prev) => [...prev, cId])
        // }
        // setCheckboxChecked((prev) => [...prev, cId])
        setCheckboxChecked((prev) => prev.concat(cId))
        // console.log(checkboxChecked)
    } else {
        // const i = checkboxChecked.indexOf(cId)
        // if (i > -1) {
        //     checkboxChecked.splice(i, 1)
        // }
        // setCheckboxChecked((prev) => prev.filter((id) => id !== cId))
        // console.log('cId='+cId)
        // setCheckboxChecked((prev) => prev.filter((id) => id !== cId))
        setCheckboxChecked((prev) => prev.filter((id) => id !== cId))
        // console.log(checkboxChecked)
    }
    // typeHebergementString = 'radioSansHebergement'
    
    // checkboxChecked.map(c => {
    //     typeHebergementString += '|' + c
    //     // setTypeHebergementString(prev => prev + '|' + c)
    //     // console.log('new value = '+typeHebergementString)
    // })
    // console.log(typeHebergementString)
    // const newT = {...t, type_hebergement: 'radioSansHebergement-'+checkboxChecked.join('|')}
    // setNewT(prev => ({...prev, type_hebergement: 'radioSansHebergement-'+checkboxChecked.join('|')}))
    // console.log('NEWT =')
    // console.log(newT)
    // t.type_hebergement = 'radioSansHebergement-'+checkboxChecked.join('|')
    // CETTE LIGNE ME POSE PROBLÈME (LES CHECKBOXES NE SE SELECTIONNENT PLUS ...)
    // JE NE SAIS PAS COMMENT METTRE A JOUR MON TERRAIN 
    // props.updateTerrain(newT)
  }

  const handleRadio = (e) => {
    // e.preventDefault()
    // alert('ok')
    // console.log(e.target.value)
    setKey(e.target.value)
    setCheckboxChecked([])
    // setTypeHebergement('')
    setSelectedOption('')
    // setTypeHebergement('')
    // typeHebergementString = e.target.value
    // t.type_hebergement = e.target.value
    // console.log(t)
    // const updatedT = {...t, type_hebergement: e.target.value}
    // props.updateTerrain(updatedT)
  }

  const handleTypeHebergement = (e) => {
    // e.preventDefault()
    // alert('changement du type d\'hébergement')
    // console.log('type hébergement = ', e.target.value)
    // setTypeHebergement('radioAvecHebergement-' + e.target.value)
    // console.log(e.target)
    setSelectedOption(e.target.value)
    // const newT = {...t, type_hebergement: 'radioAvecHebergement-' + e.target.value}
    // setNewT(prev => ({...prev, type_hebergement: 'radioAvecHebergement-' + e.target.value}))
    // t.type_hebergement = 'radioAvecHebergement-' + e.target.value
    // props.updateTerrain(newT)
  }

//   useEffect(()=>{
//     let str = ''
//     if (key !== 'radioSansHebergement') {
//         console.log('changement typeHebergement =')
//         console.log(typeHebergement)
//         console.log('changement selectedOption =')
//         console.log(selectedOption)
//         str = 'radioAvecHebergement-'+selectedOption
//     } else {
//         console.log('changement checkboxChecked =')
//         console.log(checkboxChecked)
//         str = 'radioSansHebergement-'+checkboxChecked.join('|')    
//     }
//     const newT = {...t, type_hebergement: str}
//     props.updateTerrain(newT)
//   }, [checkboxChecked, selectedOption])

  useEffect(()=>{
    // console.log('changement selectedOption =')
    // console.log(selectedOption)
    // let str = 'radioAvecHebergement-'+selectedOption
    const newT = {...t, type_hebergement: 'radioAvecHebergement-'+selectedOption}
    props.updateTerrain(newT)
  }, [selectedOption])

  useEffect(()=>{
    // console.log('changement checkboxChecked =')
    // console.log(checkboxChecked)
    // let str = 'radioSansHebergement-'+checkboxChecked.join('|')
    const newT = {...t, type_hebergement: 'radioSansHebergement-'+checkboxChecked.join('|')}
    props.updateTerrain(newT)
  }, [checkboxChecked])

  useEffect(()=>{
    if (t.id) {
        // alert('ok id')
        // console.log('typeHebergement =')
        // console.log(t.type_hebergement)
        const type = t.type_hebergement.split('-')[0]
        const radioOuCheckbox = t.type_hebergement.split('-')[1]
        if (type == 'radioSansHebergement') {
            setKey('radioSansHebergement')
            setCheckboxChecked(radioOuCheckbox.split('|'))
        } else {
            setKey('radioAvecHebergement')
            setSelectedOption(radioOuCheckbox)
        }
    } else {
        // alert('pas ok pas id')
    }
  }, [])


  const SansHebergement = () => {
    return (
        <div>
            <h2>Que souhaitez-vous acceptez sur votre terrain ?</h2>
            <p>(cochez les cases que vous souhaitez)</p>
            <div className='row text-center'>
                <div className="col-6 col-sm-6 col-md-3 mx-auto">
                    <div className="btn-group" role="group">
                        <input 
                            type="checkbox" 
                            className="btn-check" 
                            id="tente" 
                            checked={checkboxChecked.includes('tente')}
                            autoComplete="off" 
                            onChange={handleCheckboxChange}
                        />
                        <label 
                            className="btn btn-outline-primary" 
                            htmlFor="tente" 
                            style={{ color:'#25632d' }}
                        >
                            <PiTentFill id='tenteAnnonce' />
                            <div>Tente</div>
                        </label>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 mx-auto">
                    <div className="btn-group mb-3" role="group">
                        <input 
                            type="checkbox" 
                            className="btn-check" 
                            id="van" 
                            checked={checkboxChecked.includes('van')}
                            autoComplete="off" 
                            onChange={handleCheckboxChange}
                        />
                        <label 
                            className="btn btn-outline-primary" 
                            htmlFor="van"
                        >
                            <PiVanFill id='vanAnnonce' />    
                            <div>Van</div>
                        </label>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 mx-auto">
                    <div className="btn-group" role="group">
                        <input 
                            type="checkbox" 
                            className="btn-check" 
                            id="caravanne" 
                            checked={checkboxChecked.includes('caravanne')}
                            autoComplete="off" 
                            onChange={handleCheckboxChange}
                        />
                        <label 
                            className="btn btn-outline-primary" 
                            htmlFor="caravanne"
                        >
                            <FaCaravan id='caravanneAnnonce' />
                            <div>Caravanne</div>
                        </label>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 mx-auto">
                    <div className="btn-group" role="group">
                        <input 
                            type="checkbox" 
                            className="btn-check" 
                            id="campingcar" 
                            checked={checkboxChecked.includes('campingcar')}
                            autoComplete="off" 
                            onChange={handleCheckboxChange}
                        />
                        <label 
                            className="btn btn-outline-primary" 
                            htmlFor="campingcar"
                        >
                            {/* <img 
                                src="campingcarnew.png"  
                                className='img-fluid'
                                style={{ maxHeight:'150px'  }}
                            /> */}
                            <TbCamper id='camperAnnonce' />
                            <div>Camping car</div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  const AvecHebergement = () => {
    return (
        <div>
            <h2>Quel type d'hébergement mettez-vous à disposition ?</h2>
            <div className='col-12 col-md-10 col-lg-6 mx-auto'>
                <div>
                    <div className="form-floating">
                        <select 
                            className="form-select" 
                            onChange={handleTypeHebergement}
                            id="floatingSelect"
                            value={selectedOption}
                        >
                            <option value={''}>Choisir un type d'hébergement</option>
                            <option value={'Tente'}>Tente</option>
                            <option value={'Bungalo'}>Bungalo</option>
                            <option value={'Caravanne'}>Caravanne</option>
                            <option value={'Igloo'}>Igloo</option>
                            {/* <option>Autre</option> */}
                        </select>
                        <label htmlFor="floatingSelect">Choix du type d'hébergement</label>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div>
        <div className="row d-flex justify-content-center">
            <div className="col-md-4 text-center">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault" 
                        id="radioSansHebergement" 
                        // defaultChecked 
                        checked={key === 'radioSansHebergement'}
                        onChange={handleRadio}
                        value={'radioSansHebergement'}
                    />
                    <label className="form-check-label" htmlFor="radioSansHebergement">
                        Terrain sans hébergement
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        name="flexRadioDefault" 
                        id="radioAvecHebergement" 
                        checked={key === 'radioAvecHebergement'}
                        onChange={handleRadio}
                        value={'radioAvecHebergement'}
                    />
                    <label className="form-check-label" htmlFor="radioAvecHebergement">
                        Type d'hébergement
                    </label>
                </div>
            </div>
        </div>
        <div className="row">
            {
                key == 'radioSansHebergement' && <SansHebergement />
            }
            {
                key == 'radioAvecHebergement' && <AvecHebergement />
            }
        </div>
        {/* {checkboxChecked.join(', ')} */}
    </div>
  )
}
