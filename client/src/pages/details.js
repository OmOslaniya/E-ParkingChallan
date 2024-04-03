import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gresult,image } from './Home';
import { luser } from './Signin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope,faPhone } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar2 from './navbar2';
import MainNavbar from './mainnavbar';
import Footer from './footer';
import './details.css';

let mno;
const Details = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [no_plate, setNoplate] = useState(null);
  const [memonumber, setMemonumber] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showHelloMessage, setShowHelloMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading2, setLoading2] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchdetails`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            gresult,
            luser,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
        setNoplate(data.no_plate);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [gresult]);

  const handleGenerate = async () => {
    try {
      const receiptResponse = await fetch(`${process.env.REACT_APP_API_URL}/getmemonumber`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await receiptResponse.json();
      setMemonumber(data);
      console.log(data); 
      mno=data;
    } catch (error) {
      console.error('Error processing payment:', error);
    }


    try {
    setShowHelloMessage(false);
    setLoading(true);

    setTimeout(async () => {
      setLoading(false); 
      setShowHelloMessage(true); 

    }, 2000);
  } catch (error) {
    console.error('Error processing payment:', error);
    setLoading(false); // Hide the loading spinner and text in case of an error
  }    
  
  
  try {
      const resmemo = await fetch(`${process.env.REACT_APP_API_URL}/setmemonumber`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          no_plate,
          mno , 
        }),
      });                   
    //  console.log("complete");
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleSend = async () => {
    setShowConfirmation(true);
    
  };

  const handleConfirm =async () => {

    setShowConfirmation(false);
    setIsSending(true);
    setLoading2(true);

    try{
    let obj = {
      no_plate: detailsData.no_plate,
    };
    console.log(obj);

    console.log("called");
    const pdfContent = document.getElementById('pdf');
    const canvas = await html2canvas(pdfContent);
    const pdf = new jsPDF();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Create a new FormData object
    const formData = new FormData();

    // Convert the data URI to a Blob and append it to the FormData
    const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    formData.append('to', detailsData.email);
    formData.append('subject', 'Vehicle Details PDF');
    formData.append('text', 'Please find the attached PDF for your vehicle details.');
    formData.append('pdfFile', pdfBlob, 'details.pdf');
    formData.append('person', obj.no_plate);
    formData.append('police', luser);
    formData.append('memo_number', mno);

    console.log("API about to call");
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/sendEmail`, {
      method: "POST",
      body: formData,
    });

    const datas = await resp.json();
    setSuccess(true);
  } catch (error) {
    console.error('Error sending memo:', error);
    window.alert('Error sending memo. Please try again.');
  } finally {
    setIsSending(false);
    setLoading2(false);

    setShowConfirmation(false);
  }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };


  return (
    <div>
      <MainNavbar />
      <Navbar2 />

      <div className="container mt-5">
        {detailsData && (
          <div className="details-container">
            <h2 className="details-header">Here is the User Details</h2>
            <div className="details-item">Owner Name: {detailsData.name}</div>
            <div className="details-item">Address: {detailsData.address}</div>
            <div className="details-item">Email: {detailsData.email}</div>
            <div className="details-item">No_plate: {detailsData.no_plate}</div>
            <div className="details-item">Vehicle_Model: {detailsData.vehicle_type}</div>

            <button onClick={handleGenerate}>Generate Memo</button>
          </div>
        )}


{loading && (
  <div className="loading-spinner-container">
    <div className="loading-spinner">
      Generating Memo...
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </div>
)}

        {showHelloMessage && (
  <div id="pdf" className="memo-container">
    <p className="memo-date">Date: {new Date().toLocaleDateString()}</p>
    <p className="memo-memo-number">Memo Number: {memonumber}</p>
    <br />
    <h2 className="memo-title">PARKING VIOLATION NOTICE</h2>
    <br />

    <div className="memo-recipient">
      <p>RECIPIENT</p>
      <br />
    </div>

    <p className="memo-dear">Mr. {detailsData.name},</p>
    <br />
    <p className="memo-details">
        We regret to inform you that your vehicle, a <span className="vehicle-type">{detailsData.vehicle_type}</span> with the registration number <span className="no-plate">{detailsData.no_plate}</span>,
        has been captured by our esteemed law enforcement officer,<span className="vehicle-type"> {detailsData.lcop}</span>. <br />
        You may retrieve your vehicle at your earliest convenience from {detailsData.station}. <br />
        <span className="vehicle-type">We possess photographic evidence and CCTV footage validating this incident.</span> <br />
        Considering the limited parking spaces available, we kindly request your cooperation with the established rules to maintain a harmonious environment for all residents. <br />
        {image && <img src={URL.createObjectURL(image)} alt="Vehicle Image" className="memo-image" />}
        If the mentioned vehicle does not belong to you, please notify us promptly to avoid any misunderstanding. <br />

        <span className="memo-payment-info">
        Ensure that all charges are settled before visiting the station. <br />
        Payment for this violation can be made by following the link provided in the attached email.
    </span>
    <br /> Thank you for your understanding and cooperation.
    </p>

    <div className="memo-contact-details">
        For any inquiries or assistance, please contact our team at:
        <br />
        <span className="memo-contact-number"> <FontAwesomeIcon icon={faEnvelope} /> challan.support@gmail.com
</span><br />

        <span className="memo-contact-number"> <FontAwesomeIcon icon={faPhone} />+01 234 567 88</span><br />
        <span className="memo-contact-number"><FontAwesomeIcon icon={faPhone} />+01 234 567 89</span>
    </div>

    <h5 className="memo-signature">Ministry of Parking Violation</h5>

    
  </div>
 
)}
   {showHelloMessage && (
        <button className="memo-send-button" onClick={handleSend} disabled={isSending || success}>
           Send
        </button>
      )}

{loading2 && (
        <div className="loading-spinner-container">
          <div className="loading-spinner">
            Sending Memo...
            <div className="spinner-border" role="status">
            {/* <div className="custom-spinner"></div> */}
            </div>
          </div>
        </div>
      )}  

      {success && (
        <Modal show={success} onHide={() => setSuccess(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Memo sent successfully! <br />
            <button onClick={() => navigate('/officerhome')}>Back to Dashboard</button>
          </Modal.Body>
        </Modal>
      )}

<Modal show={showConfirmation} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to send the memo?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};


export default Details;
