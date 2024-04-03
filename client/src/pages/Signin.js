import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
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
let uname;
let luser;

export default function Signin() {
    
    let navigate = useNavigate();

    const handleForgotPasswordClick = () => {
      navigate("/forgotpassword");
    };

    const location = useLocation();
    const [registrationSuccessMessage, setRegistrationSuccessMessage] =
      useState(null);
    const [user, setUser] = useState({
      username: "",
      password: "",
    });
  
    useEffect(() => {
      if (location.state && location.state.registrationSuccess) {
        setRegistrationSuccessMessage("Registration successful! Please wait until you are verified by higher authority");
  
        const timeoutId = setTimeout(() => {
          setRegistrationSuccessMessage(null);
        }, 5000);
  
        return () => clearTimeout(timeoutId);
      }
    }, [location.state]);
  
    let name, value;
  
    const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
  
      setUser({ ...user, [name]: value });
    };
  
    const PostData = async (e) => {
      e.preventDefault();
  
      const { username, password } = user;
  
      if (!username || !password) {
        window.alert("Please fill all the fields properly");
        navigate("/login");
      } else {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username,
            password,
          }),
        });
  
        const data = await res.json()
  
         if (res.status === 200) {
          console.log(data);

          // window.alert("Login Successful!");
          // console.log(data)
          luser=username;
          // console.log("before");
          sessionStorage.setItem('officerToken', data.officerToken);
          // console.log("after");

          navigate("/officerhome");
        }  if (res.status === 202) {
          // window.alert("Admin login Successful!");
          uname=username; 
          // console.log("Admin Username "+uname);
          sessionStorage.setItem("adminToken", data.adminToken);
          navigate("/adminhome");
        } if (res.status == 201) {
          console.log(res.msg);
          sessionStorage.setItem("mainadminToken", data.adminToken);

        
          navigate("/mainadminhome");
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
      <MDBContainer className="my-30 gradient-form signin" style={{ marginLeft: '150px' ,marginTop: '30px'}}>

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
  
            <MDBInput wrapperClass='mb-4' label='Username'  type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleInputs}/>
                            
            <MDBInput wrapperClass='mb-4' label='Password'type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleInputs}/>


            <div className="text-center pt-1 mb-5 pb-1">
                <button className="log">SignIn</button>
            </div>

            <div className="text-center">
           <Link to="/forgotpassword" className="text-muted" onClick={handleForgotPasswordClick}>
            Forgot password?
          </Link>
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
}
export {luser,uname};