import React from 'react'

export default function BonASavoir() {

  return (
    <div className='container-fluid' style={{ background:'#0F382A', color:'white', paddingTop:'95px', paddingBottom:'95px' }}>
      <div className="row pb-5">
        <h1>Bon à savoir</h1>
      </div>
      <div className="row mx-1 py-2" style={{ backgroundColor:'#0F382A' }}>
        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            {/* <h3 className='text-center'>Article de blog</h3> */}
            <a 
                href="/pdtArticleBlog.pdf"
                style={{ textDecoration:'none',color:'white' }}
                target='_blank'
            >
                <div className="card" style={{ border:'', width:'100%',position: 'relative',height:'300px', minHeight:'250px', maxHeight:'300px', overflow:'hidden', background:'black' }} >
                    {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Article+de+blog" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                    <img src="/photo_camping.png" className="card-img-top img-fluid" style={{ height:'100%' }} />
                    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center',width:'80%' }}>
                        <h3>
                                Le slow tourisme : <br />redécouvrir le voyage
                        </h3>
                    </div>
                </div>
            </a>
        </div>
        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            {/* <h3 className='text-center'>Astuces pour les hôtes</h3> */}
            <a 
                href="/pdtAstucesHotes.pdf"
                style={{ textDecoration:'none',color:'white' }}
                target='_blank'
            >
                <div className="card" style={{ border:'',width:'100%', position: 'relative',height:'300px', minHeight:'250px', maxHeight:'300px', overflow:'hidden', background:'black' }} >
                    {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Astuce+pour+les+hôtes" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                    <img src="/photo_astuces_hotes.jpg" className="card-img-top img-fluid" style={{ height:'100%' }} />
                    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center',width:'80%' }}>
                        <h3>
                                Comment être un bon hôte
                        </h3>
                    </div>
                </div>
            </a>
        </div>
        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
            {/* <h3 className='text-center'>Astuces pour les gampeurs</h3> */}
            {/* <div className="card" style={{ border:'1px solid #25632d', width:'100%', maxHeight:'300px', overflow:'hidden' }} >
                <img src="https://placehold.co/600x400/25632d/FFF?text=Autre+chose+..." className="card-img-top img-fluid" style={{ height:'100%' }} />
            </div> */}
            {/* <a 
                href="/pdtAstucesHotes.pdf"
                style={{ textDecoration:'none',color:'white' }}
                target='_blank'
            > */}
                <div className="card" style={{ border:'',width:'100%', position: 'relative', height:'300px', minHeight:'250px', maxHeight:'300px', overflow:'hidden', background:'black' }} >
                    {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Astuce+pour+les+hôtes" className="card-img-top img-fluid" style={{ height:'' }} /> */}
                    <img src="/tente.jpg" className="card-img-top img-fluid" style={{ height:'100%' }} />
                    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center',width:'80%' }}>
                        <h3>
                                Tips and tricks
                        </h3>
                    </div>
                </div>
            {/* </a> */}
        </div>
      </div>
    </div>
  )
}
