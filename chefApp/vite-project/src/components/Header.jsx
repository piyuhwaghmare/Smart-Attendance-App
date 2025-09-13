import React from 'react'
import { Link, useNavigate} from  "react-router-dom"
import './Header.css'

const Header = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate('/login');
  }


  return (
    <nav className="header">
      <div>
        <img id='top-image' src='' alt="Attendance image" />
        <span id='title'>Smart Attendance Monitoring</span>
      </div>
      <div className='links'>
        <Link to='/main'>MainPage</Link>
        {/* <Link to='/charts'>Charts</Link>
        <Link to='/query'>Query</Link> */}
        <Link to='/login'>Login</Link>
      </div>
      <div className='logout'>
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
      </div>
    </nav>
  )
}

export default Header
