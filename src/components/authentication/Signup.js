import React,{useRef,useState} from 'react'
import {Form,Button,Card,Alert} from 'react-bootstrap'
import {useAuth} from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import CenteredContainer from './CenteredContainer'
export default function Signup() {
    const emailRef=useRef()
    const passwordRef=useRef() 
    const passwordConfirmRef=useRef()
    const navigate=useNavigate()
    const {signup}=useAuth()
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    async function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value!==passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }
        try{
            setError('')
            setLoading(true)
            await signup(emailRef.current.value,passwordRef.current.value)
            navigate('/user')
        }catch(error){
            setError('Failed to create an account')
            // setError(error)
            console.log(error)
        }
        setLoading(false)
    }

  return (
    <CenteredContainer>
    <Card>
        <Card.Body>
            <h2 className='w-100 text-center mt-2'>Sign Up</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' ref={emailRef} required/>
                </Form.Group>
            
                <Form.Group id="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control type='password' ref={passwordRef} required/>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label>confirm password</Form.Label>
                    <Form.Control type='password' ref={passwordConfirmRef} required/>
                </Form.Group>
                <Button className='w-100' type="submit">Sign Up</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className='w-100 text-center mt-2'>
        Already have an account? <Link to="/login">Login</Link>
    </div>
    </CenteredContainer>
  )
}
