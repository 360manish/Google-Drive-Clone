import React,{useRef,useState} from 'react'
import {Form,Button,Card,Alert} from 'react-bootstrap'
import {useAuth} from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import CenteredContainer from './CenteredContainer'
export default function Signup() {
    const emailRef=useRef()
    const passwordRef=useRef() 
    const {currentUser}=useAuth()
    const passwordConfirmRef=useRef()
    const navigate=useNavigate()
    const {updatePassword}=useAuth()
    const {updateEmail}=useAuth()
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    
    function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value!==passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }
        const promises=[]
        setLoading(true)
        setError('')
        if(emailRef.current.value!==currentUser.email){
            promises.push(updateEmail(emailRef.current.value))
        }
        if(passwordRef.current.value){
            promises.push(updatePassword(passwordRef.current.value))
        }
        Promise.all(promises).then(()=>{
            navigate('/user')
        }).catch((error)=>{
            console.log(error)
            setError('Failed to update acccount')
        }).finally(()=>{
            setLoading(false)
        })
       
    }

  return (
    <CenteredContainer>
    <Card>
        <Card.Body>
            <h2 className='w-100 text-center mt-2'>Update Profile</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' ref={emailRef} required defaultValue={currentUser.email}/>
                </Form.Group>
            
                <Form.Group id="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control type='password' ref={passwordRef} placeholder='Leave Blank to keep same' />
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label>confirm password</Form.Label>
                    <Form.Control type='password' ref={passwordConfirmRef} placeholder='Leave Blank to keep same' />
                </Form.Group>
                <Button className='w-100' type="submit">Update</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className='w-100 text-center mt-2'>
        Don't want to update? <Link to="/user">Cancel</Link>
    </div>
    </CenteredContainer>
  )
}
