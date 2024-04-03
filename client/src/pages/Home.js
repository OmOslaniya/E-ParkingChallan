import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFileAlt, faListUl } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import Navbar2 from './navbar2';
import MainNavbar from './mainnavbar';
import Footer from './footer';
import './home.css';

let gresult;
let image;

const OfficerHome = () => {
  const [file, setFile] = useState();
  const [plateNumber, setPlateNumber] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploaded(false);
  };

  const handlePlateNumberChange = (event) => {
    setPlateNumber(event.target.value);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('officerToken');
    console.log(token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    fetch(`${process.env.REACT_APP_PYTHON_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const resultString = data.message.join('');
        gresult = resultString;
        image = file;
        console.log(resultString);
        setUploaded(true);


        setTimeout(() => {
          setLoading(false); 
          navigate('/details');
        }, 1500);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false); 
      });
  };

  const handleGenerateChallan = async () => {
    console.log('Generating E-Challan for plate number:', plateNumber);
    try {
               gresult=plateNumber
               navigate('/details');

    } catch (error) {
      console.error('Error in processing :', error);
    }
  };


  const handleHistory = () => {
    navigate('/history');
  }
  return (
    <div className='abc d-flex flex-column min-vh-100'>
      <MainNavbar />
      <Navbar2 />
      <div className='container flex-grow-1 mt-5' style={{marginLeft:'150px'}}>
        <div className='row'>
          <div className='col-md-4 d-flex'>
            <div className='card card-capture-photo shadow p-3 mb-5 bg-white rounded w-100 d-flex flex-column align-items-center'>
              <div className='card-body flex-grow-1 d-flex flex-column align-items-center'>
                <FontAwesomeIcon icon={faCamera} className='card-icon' size='2x' />
                <h4 className='card-title'>Capture a Photo</h4>
                <input type='file' onChange={handleFileChange} accept='image/*' className='form-control mb-3' />
                <button onClick={handleUpload} className='btn btn-primary'>
                  {loading ? (
                      <div>
                      Fetching details...
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='col-md-4 d-flex'>
            <div className='card card-generate-e-challan shadow p-3 mb-5 bg-white rounded w-100 d-flex flex-column align-items-center'>
              <div className='card-body flex-grow-1 d-flex flex-column align-items-center'>
                <FontAwesomeIcon icon={faFileAlt} className='card-icon' size='2x' />
                <h4 className='card-title'>Generate E-Challan</h4>
                <input
                  type='text'
                  value={plateNumber}
                  onChange={handlePlateNumberChange}
                  placeholder='Enter Plate Number'
                  className='form-control mb-3'
                />
                <button onClick={handleGenerateChallan} className='btn btn-success'>
                  Generate E-Challan
                </button>
              </div>
            </div>
          </div>

          <div className='col-md-4 d-flex'>
            <div className='card card-view-challan-history shadow p-3 mb-5 bg-white rounded w-100 d-flex flex-column align-items-center'>
              <div className='card-body flex-grow-1 d-flex flex-column align-items-center'>
                <FontAwesomeIcon icon={faListUl} className='card-icon' size='2x' />
                <h4 className='card-title'>View Challan History</h4>
               
                
               
              </div>
              <button onClick={handleHistory} className='btn btn-primary'>
                  View Challan History
                </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OfficerHome;
export { gresult, image };
