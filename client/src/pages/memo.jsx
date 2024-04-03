import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { luser } from './Signin';

let gresult;
let image;

const Memo = () => {
  
  return (
    <>
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Home
          </Link>
          <Link className="navbar-brand" to="/history">
            History
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
          </div>
        </div>
      </nav>
      <div className="mt-3">
        
        <div className="App">
          <h2>Add Image:</h2><br />

          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload}>Upload</button>

          {uploaded && (
            <Link to="/details">
              <button>Get Details</button>
            </Link>
          )}
        </div>
      </div>
    </div></>
  );};

export default Memo;
export {gresult,image};
