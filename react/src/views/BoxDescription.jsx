import React, { useState } from 'react'
import {LuTent} from 'react-icons/lu'

export default function BoxDescription(props) {

    // const t = props.terrain
    // const [selectedValue, setSelectedValue] = useState('')

    const noOnChange = (e) => {
        alert('no onChange ...')
    }

  return (
    <div className='my-3'>
        <h5>
            {
            props.isMendatory &&
            <LuTent style={{ fontSize:'25px',color:'red', marginRight:'10px' }} /> 
            }
            {
            props.titre ? props.titre : 'Pas de titre'
            }
        </h5>
        <textarea 
            className={`form-control ${props.className ? props.className : ''}`}
            name={props.name ? props.name : 'NameParDefaut'} 
            id={props.id ? props.id : 'IdParDefaut'} 
            rows="5"
            value={props.value ? props.value : ''}
            placeholder={props.placeholder ? props.placeholder : 'Entrer quelque chose ...'}
            onChange={props.onChange ? props.onChange : noOnChange}
        ></textarea>
        <div>{props.message ? props.message : 'Message par défaut'}</div>
    </div>
  )
}
