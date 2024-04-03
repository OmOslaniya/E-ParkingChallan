// Navbar.jsx
import React,{useState,useEffect,useRef} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes } from "react-icons/fa";
import './navbar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut} from '@fortawesome/free-solid-svg-icons';
let LOGOUT_TIME=3600000;


const Navbar = () => {

  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle(
      "responsive_nav"
    );

  };
  const [username,setUsername]=useState("None");

  useEffect(() => {
    // Get the token from where you have stored it (e.g., localStorage, cookies)
    const token = sessionStorage.getItem('officerToken'); // Change this according to your storage method
  
    if (token) {
      // Decode the token
      const decodedToken = jwtDecode(token);
  
      // Access the username from the decoded token
      const { username } = decodedToken.user;
  
      // Set the username in the component state
      console.log("usernameeee: "+username);
      setUsername(username);
    }
  }, []);
  
  useEffect(() => {
    const pollingInterval = LOGOUT_TIME;
  
    // Setup polling with setInterval
    const intervalId = setInterval(() => {
      handleLogout(); // Fetch data at regular intervals
    }, pollingInterval);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 
  
  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('officerToken'); // Get the authToken from sessionStorage
      sessionStorage.removeItem('userToken'); // Clear the authToken from sessionStorage
  
      // Redirect or perform other actions after logout
      window.location.href = '/memo_login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    
    try {
      await handleLogout();
    } catch (error) {
    }
  
    delete event['returnValue'];
    return;
  });

  return (
    <header className='header2'>
       <nav ref={navRef}>
      <Link to="/memo_home">Dashboard</Link>
      <Link to="/faq">FAQ'S</Link>
      
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

export default Navbar;
