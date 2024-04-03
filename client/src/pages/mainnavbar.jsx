// Navbar.jsx
import React from 'react';
import { useEffect,useState ,useRef} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { FaBars, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { faUpload, faEye, faChartBar, faQuestion,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './mainnavbar.css'; 
import logo from'./logo.png'
let LOGOUT_TIME=3600000;


const MainNavbar = () => {

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
      // await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`, // Add the token to the headers
      //   },
      // });
  
      sessionStorage.removeItem('officerToken'); // Clear the authToken from sessionStorage
  
      // Redirect or perform other actions after logout
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
  
    // Standard for most browsers
    delete event['returnValue'];
    // For some older browsers
    return;
  });

  return (
    <header className='mainheader'>
			 <div className="logo-container">
       <img src={logo} style={{ width: '80px' }} alt="logo" /> 
             <div className="text-container">
                 <span className="additional-text">E Parking Challan Administry</span>
                    <div className="additional-text-container">
            <span className="additional-text-below">No Parking Administration Department,New Delhi</span>
          </div>
        </div>

      </div>
			<nav ref={navRef}>
				
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
		</header>  );
};

export default MainNavbar;
