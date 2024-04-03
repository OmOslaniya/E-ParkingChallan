import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import logo from './menu.png'
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faEnvelope,
  faChartBar,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons'
import './adminhome.css'
import AdminComponent from './admincomponent'
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

    const intervalId = setInterval(() => {
      handleLogout() 
    }, pollingInterval)

    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('mainadminToken') 
      sessionStorage.removeItem('mainadminToken') 

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
    }

    delete event['returnValue']
    return
  })

  useEffect(() => {
    const token = sessionStorage.getItem('mainadminToken') 
    console.log(token)

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        console.log('Decoded Token:', decodedToken)

      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const menuIcons = {
    ManageAdmins: faUser,
    RegisterVehicle: faUser,
    AnnouncementMail: faEnvelope,
    Report: faChartBar,
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
            <div style={{height: '9vh',
    fontSize: '25px',
    justifyContent: 'center',
    backgroundColor: 'antiquewhite'}}>E-Parking Challan</div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('ManageAdmins')}
            >
              Manage Admins
            </div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('RegisterVehicle')}
            >
             RegisterVehicle
            </div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('AnnouncementMail')}
            >
              AnnouncementMail
            </div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('Report')}
            >
              Report
            </div>
          </div>
        )}
      </motion.div>
      <div className='click-container'>
        <div className='navigation-container'>
          <div style={{display:"flex"}}>
            <div
              onClick={handleImageClick}
              style={{
                width: 50,
                height: 50,
                display: 'flex',
                
                cursor: 'pointer'
              }}
            >
              <img src={logo} alt='Logo' style={{width:"2vw",height:"4vh",margin:"2vh"}} />
            </div>
            <div
              style={{
                fontSize: '25px',
                paddingTop: '1vh',
                cursor: 'pointer',
                marginLeft: '1vw'
              }}
              onClick={() => handleOptionClick('DashBoard')}
            >
              Dashboard
            </div>
          </div>
          <div style={{marginLeft:showOptions ? "61vw" : "78vw"}}>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span> Logout</span>
            </button>
          </div>
        </div>
        <div>
          {selectedOption ? (
            <div className='selected-option'>
              <AdminComponent option={selectedOption} />
            </div>
          ) : (
            <div style={{ padding: '20px',
              marginLeft:'30px',
              marginTop: '50px',
              backgroundColor: '#f4f4f4',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '1000px', 
            }}>
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
