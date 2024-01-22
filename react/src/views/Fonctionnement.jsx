import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Fonctionnement() {
  return (
    <div>
        <h3 className="text-center">
            Fonctionnement
        </h3>
        <div className="row mx-1 py-2" style={{ backgroundColor:'white' }}>
            <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            <div className="card" style={{ border:'1px solid #25632d', width:'100%', height: '100%', overflow:'hidden' }} >
                {/* <img src="https://placehold.co/600x400/25632d/FFF?text=1" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                <img src="fct1.png" className="card-img-top img-fluid" style={{ height:'' }} />
            </div>
            </div>
            <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            <div className="card" style={{ border:'1px solid #25632d',width:'100%', height: '100%', overflow:'hidden' }} >
                {/* <img src="https://placehold.co/600x400/25632d/FFF?text=2" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                <img src="fct2.png" className="card-img-top img-fluid" style={{ height:'' }} />
            </div>
            </div>
            <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            <div className="card" style={{ border:'1px solid #25632d', width:'100%', height: '100%', overflow:'hidden' }} >
                {/* <img src="https://placehold.co/600x400/25632d/FFF?text=3" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                <img src="fct3.png" className="card-img-top img-fluid" style={{ height:'' }} />
            </div>
            </div>
        </div>
    </div>
  )
}
