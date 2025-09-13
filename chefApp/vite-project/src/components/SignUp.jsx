import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './SignUp.css'

const SignUp = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');
  
  const HandleSubmit = (e) => {

    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password-sign')
    }
    
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = storedUsers.some((user) => user.email === data.email);
    if (userExists) {
      setError("User with this email already exists.");
      return;
    }

    const newUser = { ...data };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    alert("Signup successful! Please log in.");
    navigate('/login')
  }

  return (
    <div id="main-signup-container">
    <div className='signup-container'>
      <h2 id='h22'>Sign Up</h2>
      <form className="Form" onSubmit = {HandleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password-sign">Password:</label>
          <input type="password" id="password-sign" name="password-sign" required />
        </div>
        <div id="signup-button">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default SignUp
