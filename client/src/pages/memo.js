import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { gresult } from './Home';
import { luser } from './Signin';

const Memo = () => {
  const [detailsData, setDetailsData] = useState(null);
  const { state } = useLocation();

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
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [gresult]);

  const handleSendEmail = async () => {
    try {
      const formData = new FormData();
      formData.append('to', detailsData.email);
      formData.append('subject', 'Vehicle Details PDF');
      formData.append('text', 'Please find the attached PDF for your vehicle details.');
      
       //Assuming you have access to the actual file
      formData.append('pdfFile', state?.pdfFile);

      const res = await fetch("${process.env.REACT_APP_API_URL}/sendEmail", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        window.alert('Email sent successfully');
      } else {
        window.alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      window.alert('Failed to send email');
    }
  };
  
  return (
    <div>
      <p>Please Verify The Details</p>
      <div style={{ width: '100%', height: '90vh', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
          <Viewer fileUrl={state?.pdfDataUri} />
        </Worker>
        <button onClick={handleSendEmail}>Send</button>
      </div>
    </div>
  );
};

export default Memo;
