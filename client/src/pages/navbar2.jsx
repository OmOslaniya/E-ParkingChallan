import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut} from '@fortawesome/free-solid-svg-icons';


import './navbar2.css';
let LOGOUT_TIME = 3600000;

const Navbar2 = () => {

  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle(
      "responsive_nav"
    );
  };

  const [username, setUsername] = useState("None");

  useEffect(() => {
    const token = sessionStorage.getItem('officerToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { username } = decodedToken.user;
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    const pollingInterval = LOGOUT_TIME;
    const intervalId = setInterval(() => {
      handleLogout();
    }, pollingInterval);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('officerToken');
      sessionStorage.removeItem('officerToken');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    try {
      await handleLogout();
    } catch (error) {
      // Handle errors, if any
    }
    delete event['returnValue'];
    return;
  });

  return (
    <header className='header2'>
       <nav ref={navRef}>
      <Link to="/officerhome">Dashboard</Link>
      <Link to="/faq">FAQ'S</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contact">Contact Us</Link>
      <button
        className="nav-btn nav-close-btn"
        onClick={showNavbar}>
        <FaTimes />
      </button>
      <Link to="/profile"><FontAwesomeIcon icon={faSignOut} onClick={handleLogout} /> </Link> 
    </nav>
      <button
        className="nav-btn"
        onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
};

export default Navbar2;
