import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css'
import "bootstrap/dist/css/bootstrap.min.css";
import logo from'./logo.png'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
from 'mdb-react-ui-kit';
let email;

export default function ForgotPassword() {
    
    let navigate = useNavigate();

    const handleForgotPasswordClick = () => {
      navigate("/forgotpassword");
    };
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState("");
    const [otpMatchError, setOtpMatchError] = useState("");

    
    const [user, setUser] = useState({
      email: "",
      
    });
  
    let name, value;
  
    const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
  
      setUser({ ...user, [name]: value });
    };

    email = user.email;
    const sendEmail = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/sendotp`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: user.email,
          }),
        });
  
        const data = await res.json();
        console.log("opt is "+data.otp);
        if (res.status === 200) {
          setOtp(data.otp);
          setOtpSent(true);
          window.alert("OTP sent successfully to your email!");
      } else {
          window.alert("Failed to send OTP. Please try again.");
      }

      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    };
  
    const handleSendClick = async (e) => {
      e.preventDefault();
      await sendEmail();
    };
    
    const handleVerifyOTP = (e) => {
      e.preventDefault(); 
      console.log("verification");
      console.log(otp);
      console.log(enteredOtp);

      if (otp === enteredOtp) {
        navigate("/newpassword");
    } else {
        window.alert("Incorrect OTP. Please try again.");
    }
  };
  
  return (
    <MDBContainer className="my-10 gradient-form" style={{ marginLeft: '150px' ,marginTop: '30px'}}>
        <MDBRow>
            <MDBCol col='10' className="mb-5">
                <div className="d-flex flex-column ms-10">
                    <div className="text-center">
                        <img src={logo}
                            style={{ width: '105px' }} alt="logo" />
                        <h4 className="mt-1 mb-5 pb-1">No Parking Administry Team</h4>
                    </div>

                    <p>{otpSent ? "Please enter the OTP sent to your email" : "Please enter your Email Address"}</p>

                    <form method="post">
                        <MDBInput wrapperClass='mb-4' label='Enter Your Email' type="text"
                            id="username"
                            name="email"
                            value={user.email}
                            onChange={handleInputs} />

                        {otpSent && (
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Enter OTP'
                                type="text"
                                id="otp"
                                name="otp"
                                value={enteredOtp}
                                onChange={(e) => {
                                  setEnteredOtp(e.target.value);
                                  setOtpMatchError(e.target.value.length !== 6 || e.target.value !== otp ? "OTP is incorrect" : "");
                              }}
                              className={otpMatchError ? 'is-invalid' : ''}
                                />
                        )}
                        {otpMatchError && (
                             <div className="invalid-feedback">
                             {otpMatchError}
                            </div>
                        )}

                        <div className="text-center pt-1 mb-5 pb-1">
                            {otpSent ? (
                                <button className="log" onClick={handleVerifyOTP}>Verify OTP</button>
                            ) : (
                                <button className="log" onClick={handleSendClick}>Send</button>
                            )}
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

export { email };
