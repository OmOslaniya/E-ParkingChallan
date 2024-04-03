import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { no_plate } from './memo_login';
import './personhistory.css';
import { jsPDF } from 'jspdf';
import MainNavbar from './mainnavbar';
import Navbar from './navbar';
import Footer from './footer';

const Personhistory = () => {
  const [detailspData, setDetailspData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [expandedIndices, setExpandedIndices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        // console.log("person history");


        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchmemodetails`, {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({
                no_plate,
              }),
            });
    
            const data = await res.json();
            setDetailspData(data); 
            
          } catch (error) {
            console.error('Error fetching details:', error);
          }


      try {
        
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchpersonhistory`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            no_plate,        
          }),
        });

        const data = await res.json();
        console.log(data);
        setDetailsData(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [no_plate]);

const handleToggleDetails = (index) => {
    setExpandedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        
        return prevIndices.filter((i) => i !== index);
      } else {
       
        return [...prevIndices, index];
      }
    });
  };
const handleDownloadReceipt = (obj) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    });

    // Add border
    doc.setDrawColor(44, 62, 80);
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Receipt', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Ministry Details
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Ministry of No Parking Violation', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.text('Address Line Here', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    doc.text('Phone: 555-555-55555', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('Fax: 123-123-123456', doc.internal.pageSize.width / 2, 60, { align: 'center' });
    doc.text('Email: abc@gmail.com', doc.internal.pageSize.width / 2, 70, { align: 'center' });

    // Receipt Details
    doc.setFont('times', 'normal');
    doc.text(`Receipt Id: ${obj.rno}`, 20, 90);
    doc.text(`Memo-Number: ${obj.mno}`, 20, 100);
    doc.text(`Memo_Date: ${obj.date}`, 20, 110);

    // Payment Details
    doc.setFont('times', 'bold');
    doc.setFontSize(16);

    doc.text('Payment Details', doc.internal.pageSize.width / 2, 130, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(14);

    doc.text(`From: ${detailspData.name}`, 20, 140);
    doc.text(`Address: ${detailspData.address}`, 20, 150);
    doc.text(`Payment received from ${detailspData.name} of amount 2000Rs. for parking violation`, 20, 160, { maxWidth: doc.internal.pageSize.width - 40 });
    doc.text(`Payment-Date: ${obj.status}`, 20, 180);
    doc.text(`Transaction_No: ${obj.tno}`, 20, 190);

    // Save the PDF
    doc.save('payment_receipt.pdf');
  };

  return (
    <div>
    <MainNavbar />
    <Navbar />

    <div className="container mt-3" style={{ marginLeft: '150px'}}>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Memo Number</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(detailsData) && detailsData.map((obj, index) => (
            <React.Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{obj.mno}</td>
                <td>{new Date(obj.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className={obj.flag === 'true' ? 'text-success' : 'text-danger'}>
                  {obj.flag === 'true' ? 'Paid' : 'Unpaid'}
                </td>
                <td>
  <button
    className={`btn btn-link toggle-button ${expandedIndices.includes(index) ? 'expanded' : ''}`}
    onClick={() => handleToggleDetails(index)}
  >
    {expandedIndices.includes(index) ? (
      <i className="bi bi-dash"></i>
    ) : (
      <i className="bi bi-plus"></i>
    )}
    
  </button>
  {obj.flag === 'true' && (
    <button
      className="btn btn-primary"
      onClick={() => handleDownloadReceipt(obj)}
    >
      Download Receipt
    </button>
  )}
</td>

              </tr>
              <tr>
                <td colSpan="5">
                {expandedIndices.includes(index) && (
                    <div className="additional-details">
                      <table className="table table-bordered table-sm">
                        <tbody>
                          <tr>
                            <th scope="row">Memo Number</th>
                            <td>{obj.mno}</td>
                          </tr>
                          <tr>
                            <th scope="row">Owner Name</th>
                            <td>{obj.pobj.name}</td>
                          </tr>
                          
                          
                          {obj.flag === 'true' && (
                            <tr>
                              <th scope="row">Pay Date</th>
                              <td>{new Date(obj.status).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
  </div>
  );
};

export default Personhistory;
