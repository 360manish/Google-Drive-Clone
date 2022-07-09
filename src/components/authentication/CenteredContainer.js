import React, { Children } from 'react'
import { Container } from 'react-bootstrap'
export default function CenteredContainer({children}) {
  return (
    <Container
    className="my-4 d-flex align-item-center justify-content-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="w-100" style={{ maxWidth: "400px" }}>
        {children}
        </div>
        </Container>
  )
}
