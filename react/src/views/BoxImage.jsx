import React from 'react'
import {LuTent} from 'react-icons/lu'
import {MdPhotoCamera} from 'react-icons/md'

export default function BoxImage(props) {
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
            <div className='row'>
                <div className="col-12 text-center p-3" style={{ border:'1px solid #25632d' }}>
                    <MdPhotoCamera style={{ fontSize: '50px', color:'#25632d' }} />
                    <div className='my-3'>{props.conseil ? props.conseil : 'Pas de conseil ...'}</div>
                    <div
                        className={`mx-auto ${props.className ? props.className : ''}`}
                    >
                        <input 
                            type="file" 
                            multiple
                            className={'form-control'}
                            id={props.id ? props.id : 'IdParDefaut'}
                            onChange={props.onChange ? props.onChange : noOnChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
