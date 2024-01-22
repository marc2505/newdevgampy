import React from 'react'

export default function PartenaireGampy() {

  return (
    <div className='container-fluid' style={{ paddingTop:'70px', paddingBottom:'70px' }}>
      <div className="row pb-5">
        <h1>Nos partenaires</h1>
      </div>
      <div className="row mx-1 py-2" style={{ backgroundColor:'white' }}>
        <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
          <a href="https://mycamper.ch/fr" target='_blank' style={{ textDecoration:'none', color:'black' }}>
          <div className="card" style={{ border:'1px solid #25632d', width:'100%', height: '100%', minHeight:'250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <img src="campingcar.svg" className="card-img-top img-fluid" style={{ height:'', width: '80%' }} />
            {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Location+Camping-Car" className="card-img-top img-fluid" style={{ height:'' }} /> */}
            <div style={{ position: 'absolute', bottom: '-6%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', textAlign: 'center',width:'80%' }}>
                <h3>
                    mycamper.ch
                </h3>
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
        <a href="https://caravan-shop.ch/" target='_blank' style={{ textDecoration:'none', color:'black' }}>
          <div className="card" style={{ border:'1px solid #25632d',width:'100%', height: '100%', minHeight:'250px', display: 'flex', alignItems: 'center', justifyContent: 'center'  }} >
            <img src="caravanneshop.png" className="card-img-top img-fluid" style={{ height:'', width: '80%' }} />
            {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Achat+accessoires+camping" className="card-img-top img-fluid" style={{ height:'' }} /> */}
            <div style={{ position: 'absolute', bottom: '-6%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', textAlign: 'center',width:'80%' }}>
                <h3>
                    caravanneshop.ch
                </h3>
            </div>
          </div>
          </a>
        </div>
        <div className="col-md-4 col-lg-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
          <div className="card" style={{ border:'1px solid #25632d', width:'100%', height: '100%', minHeight:'250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <img src="devenirPartenaire.png" className="card-img-top img-fluid" style={{ /*maxHeight:'250px'*/height:'', width:'80%', overflow:'hidden' }} />
            {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Prochain+partenaire+à+venir" className="card-img-top img-fluid" style={{ height:'' }} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
