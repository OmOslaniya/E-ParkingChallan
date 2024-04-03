import React, { useState } from 'react';
import './memo_login.css'; // Import the CSS file
import {Link, useNavigate } from 'react-router-dom';
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
let no_plate;

const Memo_login = () => {

  let navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    navigate("/forgotpassword");
  };

 
  const [error, setError] = useState(null);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] =
  useState(null);
  const [user, setUser] = useState({
    vehicleNumber: "",
    dob: "",
});

let name, value;

const handleInputs = (e) => {
  name = e.target.name;
  value = e.target.value;

  setUser({ ...user, [name]: value });
};

const PostData = async (e) => {
  e.preventDefault();

  const { vehicleNumber, dob } = user;

  if (!vehicleNumber || !dob) {
    window.alert("Please fill all the fields properly");
    navigate("/login");
  } else {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/memologin`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        vehicleNumber,
        dob,
      }),
    });

    const data = await res.json()

    if (res.status === 200) {
        console.log(data);
       
        sessionStorage.setItem('userToken', data.userToken);
        navigate('/memo_home');
        no_plate = vehicleNumber;
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }     

      if (res.status == 401) {
      console.log("400001");
      console.log(data);

      window.alert("Incorrect username or password");
      navigate("/login");
    }

  }
  
};

  return (
    <MDBContainer className="my-10 gradient-form signin" style={{ marginLeft: '130px',marginTop:'50px' }}>

      <MDBRow>

        <MDBCol col='10' className="mb-5">
          <div className="d-flex flex-column ms-10">

            <div className="text-center">
              <img src={logo}
                style={{width: '105px'}} alt="logo" />
              <h3 className="mt-1 mb-5 pb-1">No Parking Administry</h3>
            </div>

            <p>Please login to your account</p>

            <form method="post" onSubmit={PostData}>

             {registrationSuccessMessage && (
                        <div className="alert alert-success" role="alert">
                          {registrationSuccessMessage}
                        </div>
                      )} 
  
            <MDBInput wrapperClass='mb-4' label='Number Plate'  type="text"
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={user.vehicleNumber}
                            onChange={handleInputs}/>
                            
            <MDBInput wrapperClass='mb-4' label='Date of Birth'type="date"
                            id="dob"
                            name="dob"
                            value={user.dob}
                            onChange={handleInputs}/>


            <div className="text-center pt-1 mb-5 pb-1">
                <button className="log">SignIn</button>
            </div>
            
            </form>

          </div>

        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h3 className="mb-4 black">E-Parking Challan System</h3>
              <p className="small mb-0 white-text"><strong>
              Our mission is to streamline the parking management process, making it efficient and convenient for both officers and vehicle owners. As an officer, you play a crucial role in enforcing parking regulations and ensuring the smooth flow of traffic.
              </strong>
             
              </p>
            </div>

          </div>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
};

export default Memo_login;
export {no_plate};
