import React from 'react'
import TabsAdmin from './TabsAdmin'
import Container from 'react-bootstrap/Container'

export default function HomeAdmin() {
  return (
    <Container>
      <h1 className="text-center mb-3">Administrateur GAMPY</h1>
      <TabsAdmin />
    </Container>
  )
}
