import React from 'react'

export default function CommentCaMarche() {

  return (
    <div className='container-fluid'>
      <div className="row">
        <h1>Comment ça marche ?</h1>
      </div>
      <div className="row mx-1 py-2" style={{ backgroundColor:'white' }}>
        {/* <div className="col-md-6 col-lg-5 col-xl-5 mb-sm-2 mb-xs-2 mb-2 mx-auto">
          <div className="card" style={{ border:'1px solid #25632d', width:'100%', height: '100%' }} >
            <img src="https://placehold.co/600x400/25632d/FFF?text=Pour+les+hôtes" className="card-img-top img-fluid" style={{ height:'' }} />
          </div>
        </div>
        <div className="col-md-6 col-lg-5 col-xl-5 mb-sm-2 mb-xs-2 mb-2 mx-auto">
          <div className="card" style={{ border:'1px solid #25632d',width:'100%', height: '100%' }} >
            <img src="https://placehold.co/600x400/25632d/FFF?text=Pour+les+gampeurs" className="card-img-top img-fluid" style={{ height:'' }} />
          </div>
        </div> */}
        <div id='imageMobile' className="col-sm-12 col-md-10 m-auto">
            <img src="hotesetgampeurs.png" className='img img-fluid' />
        </div>
      </div>
    </div>
  )
}
