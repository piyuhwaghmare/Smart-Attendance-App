import React from 'react'
import {useState} from 'react';
import './Login.css'
import {useNavigate} from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('emaill'),
      password: formData.get('password')
    }

   

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const user = storedUsers.find((user) => user.email === data.email && user.password === data.password);

    if(user) {
      alert("Login successful!");
      navigate('/main');
    }
    else {
      setError("Invalid email or password.");
    }

    e.currentTarget.reset();
  }

  return (
    <div className='login-container'>
      <h1 id='h1'>Login here</h1>
      <form className='FORM' onSubmit = {handleSubmit}>
        <div>
          <label id='emaill'>Email</label>
          <input type='text' id='emaill' name='emaill' required />
        </div>
        <br />
        <div>
          <label id='password'>Password</label>
          <input type='password' id='password' name='password' required />
        </div>
        <br />
        <div>
          <button type='submit'>Login</button> 
        </div>
      </form>
    </div>
  )
}

export default Login
