import React from 'react'
import "../aut.form.scss"
import {Link} from "react-router"
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const Login = () => {

  const {loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("")

  const handleSubmit = async (e)=>{
    e.preventDefault();
    await handleLogin({email,password});
    navigate('/')
  }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>{
              setemail(e.target.value)
            }} type="email" name="email" id="email" placeholder='Enter email address' />

          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e)=>{
              setpassword(e.target.value)
            }} type="password" name="password" id="password" placeholder='Enter password' />
          </div>
          <button className='button primary-button'>Login</button>

        </form>
        <p>Don't have an Account? <Link to={"/Register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login
