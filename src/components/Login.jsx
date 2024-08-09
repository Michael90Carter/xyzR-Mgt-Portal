import React, {useRef, useEffect, useState} from 'react'
import { Button } from '.';
import Dashboard from '../pages/Dashboard';
import './Login.css'

function Login() {
  const [showDashboard, setShowDashboard] = useState(false)
  const localsignin = localStorage.getItem('signin')
  useEffect (()=>{
    if(localsignin){
      setShowDashboard(true)
    }

  })
  const user_name = useRef()
  const email = useRef()
  const password = useRef()
  const handleClick=()=>{
    if(user_name.current.value&&email.current.value&&password.current.value)
    {
      localStorage.setItem('Name', user_name.current.value)
      localStorage.setItem('email', email.current.value)
      localStorage.setItem('password', password.current.value)
      alert('Account Created Successfully')
      window.location.reload()
    }
  }
  return (

    <div className='flex gap-10 flex-wrap
    justify-center'>
      {showDashboard? <Dashboard />:  
            <div className='container '
            >
                  <div>
                    <input placeholder='Enter User Name' type = 'text' ref = {user_name}/>
                  <div/>
                  <div>
                    <input placeholder='Enter Email' type = 'email' ref = {email}/>
                  </div>
                  <div>
                    <input placeholder='Enter Password' type = 'password' ref = {password} />
                  </div>
              </div>
                  <div className='mt-5'>
                    <button onClick={handleClick} className = '' bgColor = 'blue'>
                        login
                    </button>
                    <Button 
                      text= 'Cancel'
                      className = 'mt-3'
                      color='white'
                      bgColor='RED'
                      borderRadius='15%'
                    />
                  </div>
              </div>        
        } 
     
    </div>
  )
}

export default Login
