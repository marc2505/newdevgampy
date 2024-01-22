import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function InfosHotes() {
  return (
    <div>
        <h3 className="text-center">
            Infos hôtes
        </h3>
        {/* <Row className='align-items-center text-center' style={{ height:'550px', color:'white' }}> */}
            <Col xs='12' sm='10' md='6' lg='4' style={{ height: '100%', margin:'auto' }}>
                <a href="2.png" target='_blank' style={{ height:'100%', width: '100%', display: 'block' }}>
                    <img src="1.png" className='' height={'100%'} width={'100%'} />
                </a>
            </Col>
        {/* </Row> */}
    </div>
  )
}
