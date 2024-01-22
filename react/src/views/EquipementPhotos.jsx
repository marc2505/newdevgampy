import React from 'react'

export default function EquipementPhotos(props) {
    const handleNoOnChange = (e) => {
        e.preventDefault()
        console.log('changement de l\'input ...')
    }
  return (
    <div className={`${props.classNameComp ? props.classNameComp : ''}`}>
        <h5>Ajouter des photos</h5>
        <input 
            className={`form-control ${props.classNameInput ? props.classNameInput : ''}`}
            id={props.id ? props.id : 'noId'}
            onChange={props.onChange ? props.onChange : handleNoOnChange}
            type="file"
            multiple 
        />

    </div>
  )
}
