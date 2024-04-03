import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import logo from './menu.png'
import icon from './logo.png'
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faEnvelope,
  faChartBar,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons'
import './adminhome.css'
import GenralComponent from './GeneralComponent'
import { jwtDecode } from 'jwt-decode'
let LOGOUT_TIME = 3600000

const AdminPage = () => {
  const [username, setUsername] = useState('None')
  const [selectedOption, setSelectedOption] = useState(null)
  const [menuVisible, setMenuVisible] = useState(true)
  const [showOptions, setShowOptions] = useState(false)

  const handleImageClick = () => {
    setShowOptions(!showOptions)
  }

  const handleOptionClick = async option => {
    setSelectedOption(option)
  }

  useEffect(() => {
    const pollingInterval = LOGOUT_TIME

    // Setup polling with setInterval
    const intervalId = setInterval(() => {
      handleLogout() // Fetch data at regular intervals
    }, pollingInterval)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('adminToken') // Get the authToken from sessionStorage
      sessionStorage.removeItem('adminToken') // Clear the authToken from sessionStorage

      // Redirect or perform other actions after logout
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  window.addEventListener('beforeunload', async event => {
    event.preventDefault()

    try {
      await handleLogout()
    } catch (error) {
      // Handle errors, if any
    }

    // Standard for most browsers
    delete event['returnValue']
    // For some older browsers
    return
  })

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken') // Retrieve the token from where you store it
    console.log(token)

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        console.log('Decoded Token:', decodedToken)

        // Now you can access the decoded information like decodedToken.user.username
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const menuIcons = {
    ManageOfficers: faUser,
    AnnouncementMail: faEnvelope,
    Report: faChartBar
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className='main-container'>
      <motion.div
        className='sidebar-container'
        animate={{ opacity: showOptions ? 1 : 0, x: showOptions ? 0 : -10 }}
      >
        {showOptions && (
          <div>
            <div
              style={{
                height: '9vh',
                fontSize: '18px',
                justifyContent: 'center',
                backgroundColor: 'beige',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img style={{ width: '45px', height: '45px' }} src={icon}></img>
              E-Parking Challan
            </div>
            <div
              className='option-container'
              style={{
                backgroundColor:
                  selectedOption === 'ManageOfficers'
                    ? 'rgb(39, 38, 38)'
                    : 'transparent'
              }}
              onClick={() => handleOptionClick('ManageOfficers')}
            >
              Manage Officers
            </div>
            <div
              className='option-container'
              style={{
                backgroundColor:
                  selectedOption === 'AnnouncementMail'
                    ? 'rgb(39, 38, 38)'
                    : 'transparent'
              }}
              onClick={() => handleOptionClick('AnnouncementMail')}
            >
              AnnouncementMail
            </div>
            <div
              className='option-container'
              style={{
                backgroundColor:
                  selectedOption === 'Report'
                    ? 'rgb(39, 38, 38)'
                    : 'transparent'
              }}
              onClick={() => handleOptionClick('Report')}
            >
              Report
            </div>
            <div>
              <button onClick={handleLogout} style={{marginTop:"53vh",marginLeft:"4.5vw"}}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span> Logout</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <div className='click-container'>
        <div className='navigation-container'>
          <div style={{ display: 'flex' }}>
            {!showOptions &&
              <div
              style={{
                height: '8vh',
                width: '15vw',
                fontSize: '18px',
                justifyContent: 'center',
                backgroundColor: 'beige',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                marginLeft:"0.5vw"
              }}
            >
              <img style={{ width: '45px', height: '45px' }} src={icon}></img>
              E-Parking Challan
            </div>

            }
            <div
              style={{
                fontSize: '25px',
                paddingTop: '1vh',
                cursor: 'pointer',
                marginLeft: showOptions ? '70vw' : '71.5vw'
              }}
              onClick={() => handleOptionClick('DashBoard')}
            >
              Dashboard
            </div>
            <div
              onClick={handleImageClick}
              style={{
                width: 50,
                height: 50,
                display: 'flex',

                cursor: 'pointer'
              }}
            >
              <img
                src={logo}
                alt='Logo'
                style={{ width: '2vw', height: '4vh', margin: '2vh' }}
              />
            </div>
          </div>
        </div>
        <div>
          {selectedOption ? (
            <div className='selected-option'>
              <GenralComponent option={selectedOption} />
            </div>
          ) : (
            <div
              style={{
                padding: '20px',
                marginLeft: '30px',
                marginTop: '50px',
                backgroundColor: '#f4f4f4',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '1000px'
              }}
            >
              <h1>Welcome to the Admin Dashboard</h1>
              <p>Manage Officers and parking activities with ease!</p>
              <p>Select an option from the menu to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
