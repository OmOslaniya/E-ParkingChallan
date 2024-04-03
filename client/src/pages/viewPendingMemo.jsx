import React, { useState, useEffect } from 'react';
import './memo_home.css';
import { Link, useNavigate } from 'react-router-dom';
import { no_plate } from './memo_login';
import Navbar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faListUl } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './viewpendingmemo.css';
import logo from '../logo.svg';
import MainNavbar from './mainnavbar';
import Footer from './footer';

let name;
let mdate, pdate, tno, rno,mno;

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
};


const ViewPendingMemo = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [paymentData, setPaymentData] = useState();
  const [receipt, setReceipt] = useState(null);
  const [data, setdata] = useState(null);
  const [rn, setRn] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res2 = await fetch(`${process.env.REACT_APP_API_URL}/getflag`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            no_plate,
          }),
        });
        console.log("insert");
        const data3 = await res2.json();
        setdata(data3);
        mno=data3.mno;
        // console.log(data3);
      } catch (error) {
        console.error('Error fetching status:', error);
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchmemodetails`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            no_plate,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
        name = data.name;
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [no_plate]);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken"); // Retrieve the token from where you store it
    console.log(token);

  if (token) {
    try {                           
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      
      // Now you can access the decoded information like decodedToken.user.username
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}, []);



  const handlePay = async () => {
    try {

      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );
  
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }
  
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/orders`);
  
      if (!result) {
        alert('Server error. Are you online?');
        return;
      }
  
      const { amount, id: order_id, currency } = result.data;
  
      const options = {
        key: 'rzp_test_UXwDn93TnrUjql', 
        amount: amount.toString(),
        currency: currency,
        name: 'E Parking Adimisrty.',
        description: 'Pay your find here',
        image: { logo },
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          console.log("before success");

          tno=response.razorpay_payment_id;
          rno=response.razorpay_order_id;

          console.log(tno);
          console.log(rno);

         

          const updateHistoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/changehistory`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              no_plate,
              rno,
              tno,
            }),
          });
  
          const updatedHistoryData = await updateHistoryResponse.json();
          console.log(updatedHistoryData);
  
          // Update paymentData state
          setPaymentData(updatedHistoryData);
          mdate = updatedHistoryData.memodate;
          pdate = updatedHistoryData.paydate;
  
          // Navigate to the receipt page after processing the payment
          navigate('/receipt');


          const result = await axios.post(`${process.env.REACT_APP_API_URL}/success`, data);
  
          alert(result.data.msg);
        },
        prefill: {
          name: 'E Parking Adminsitry',
          email: 'example@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Example Corporate Office',
        },
        theme: {
          color: '#61dafb',
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error processing payment:', error);
    }
    
  };
  const handleShowReceipt = () => {
    setShowReceiptDetails(true);
  };
  
  const renderDetails = () => {
    if (data && data.flag === "false" && detailsData) {
      return (
        <div className="details-container" style={{ marginTop: '2rem' }}>
    <div className="details-info" style={{ padding: '1rem', border: '1px solid #ddd' }}>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Memo Number: <span className="highlight" style={{ fontWeight: 'bold' ,color:'red'}}>{data.mno}</span></p>
      <h2 className="name" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{detailsData.name}</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}><strong>Address:</strong> {detailsData.address}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}><strong>Number Plate:</strong> {detailsData.no_plate}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><strong>Vehicle Type:</strong> {detailsData.vehicle_type}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pay the below Charges</p>
      <button className='pay-button' style={{ backgroundColor: '#4CAF50', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handlePay}>Pay</button>
    </div>
  </div>
    );
  } else {
    return (
      <div className="no-memo-card">
      <p className="no-memo-text"><strong>No Pending Memo</strong></p>
    </div>
    );
  }
  return null;
}

  return (
    <div>
    <MainNavbar/>
    <Navbar/>
 
{renderDetails()}


                            
    <Footer/>
  </div>
  );
};


export default ViewPendingMemo;
