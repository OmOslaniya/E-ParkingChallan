import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import './SignIn.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { email } from "./forgotPassword";
import logo from'./logo.png'

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
from 'mdb-react-ui-kit';


export default function NewPassword() {
    
    let navigate = useNavigate();
    const [user, setUser] = useState({
      password: "",
      rpassword: "",
      
    });
  
    let name, value;
  
    const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
  
      setUser({ ...user, [name]: value });
    };
 
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
    
        const { password, rpassword } = user;
    
        if (password === rpassword) {
          console.log("Passwords match. Update password logic here.");
          
            try {
              const res = await fetch(`${process.env.REACT_APP_API_URL}/updatepassword`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    password: user.password,
                    email:email,
                }),
              });
              
            if (res.status === 200) {
                window.alert("Password updated successfully!");
            } 
              navigate("/login");
      
            } catch (error) {
              console.error("Error sending OTP:", error);
            }
          
        
        } else {
          window.alert("Passwords do not match. Please try again.");
        }
      };
  
  return (
    <MDBContainer className="my-10 gradient-form" style={{ marginLeft: '130px',marginTop:'50px' }}>
        <MDBRow>
            <MDBCol col='10' className="mb-5">
                <div className="d-flex flex-column ms-10">
                    <div className="text-center">
                        <img src={logo}
                            style={{ width: '105px' }} alt="logo" />
                        <h4 className="mt-1 mb-5 pb-1">No Parking Administry Team</h4>
                    </div>

                    <form method="post">
                        <MDBInput wrapperClass='mb-4' label='Enter New Password' type="text"
                            id="username"
                            name="password"
                            value={user.password}
                            onChange={handleInputs} />

                        
                            <MDBInput wrapperClass='mb-4' label='Repeat Password' type="text"
                                id="otp"
                                name="rpassword"
                                value={user.rpassword}
                                onChange={handleInputs}
                            />
                        

                        <div className="text-center pt-1 mb-5 pb-1">
                            
                                <button className="log" onClick={handleUpdatePassword} >Update</button>
                            
                        </div>
                    </form>
                </div>
            </MDBCol>

            <MDBCol col='6' className="mb-5">
                <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                        <h4 className="mb-4 black">E-Parking Challan System</h4>
                        <p className="small mb-0 white-text">
                            Our mission is to streamline the parking management process, making it efficient and convenient for both officers and vehicle owners. As an officer, you play a crucial role in enforcing parking regulations and ensuring the smooth flow of traffic.
                        </p>
                    </div>
                </div>
            </MDBCol>
        </MDBRow>
    </MDBContainer>
);
}

