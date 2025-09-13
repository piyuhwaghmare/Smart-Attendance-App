import React from 'react'
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
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
    <div>
      <h1>Login here</h1>
      <form onSubmit = {handleSubmit}>
        <label id='email'>Email</label>
        <input type='text' id='email' name='email' />
        <br />
        <label id='password'>Password</label>
        <input type='password' id='password' name='password' />
        <br />
        <button type='submit'>Login</button> 
      </form>
    </div>
  )
}

export default Login
