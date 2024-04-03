import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { luser } from './Signin';
import Navbar2 from './navbar2';
import MainNavbar from './mainnavbar';
import Footer from './footer';
import { Modal, Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import './history.css';

const History = () => {
  const [detailsData, setDetailsData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showUnpaidMemos, setShowUnpaidMemos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = '/fetchAllMemos';

        // If year and month are selected, use the new endpoint
        if (selectedYear && selectedMonth) {
          apiUrl = '/fetchMemosByYearMonth';
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}${apiUrl}`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            luser,
            status: showUnpaidMemos ? 'false' : 'true',
            year: selectedYear,
            month: selectedMonth,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [luser, showUnpaidMemos, selectedYear, selectedMonth]);


  const handleToggleDetails = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };


  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);

    // Clear the selected month when the year changes
    setSelectedMonth('');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };


  const handleNotifyAll = async () => {
    try {
      setLoading(true);
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifyAll`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          luser,
          memos: detailsData.filter((obj) => obj.flag === 'false'),
        }),
      });
  
      if (response.ok) {
        console.log('Notify emails sent successfully.');
        // Open the modal directly when emails are sent successfully
        setShowAlert(true);
      } else {
        console.error('Error sending notification emails.');
        window.alert('Error sending notification emails. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  


  const renderAdditionalDetails = (obj, index) => {
    if (expandedIndex === index) {
      return (
        <div className="additional-details">     
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <tbody>
                <tr>
                  <th scope="row">Memo Number</th>
                  <td>{obj.memo_number}</td>
                </tr>
                <tr>
                  <th scope="row">Owner Name</th>
                  <td>{obj.pobj.name}</td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>{obj.pobj.address}</td>
                </tr>
                <tr>
                  <th scope="row">Vehicle Type</th>
                  <td>{obj.pobj.vehicle_type}</td>
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
        </div>
      );
    }
    return null;
  };

  const renderTable = () => {
      const filteredData = Array.isArray(detailsData) ? detailsData.filter(obj =>
        obj.pobj.no_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.memo_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.pobj.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : [];
    

    if (showUnpaidMemos) {
      const unpaidMemos = filteredData.filter((obj) => obj.flag === 'false');

      return (
        <div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">No Plate</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {unpaidMemos.map((obj, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{obj.pobj.no_plate}</td>
                  <td>{new Date(obj.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className={obj.flag === 'true' ? 'text-success' : 'text-danger'}>
                    {obj.flag === 'true' ? 'Paid' : 'Unpaid'}
                  </td>
                  <td>
                    <button
                      className={`btn btn-link toggle-button ${expandedIndex === index ? 'expanded' : ''}`}
                      onClick={() => handleToggleDetails(index)}
                    >
                      {expandedIndex === index ? (
                        <i className="bi bi-dash"></i>
                      ) : (
                        <i className="bi bi-plus"></i>
                      )}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">{renderAdditionalDetails(obj, index)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {unpaidMemos.length > 0 && (
        <div className="text-center mt-3">
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" onClick={handleNotifyAll} disabled={loading}>
            {loading ? (
              <>
                Sending... <Spinner animation="border" size="sm" />
              </>
            ) : (
              'Notify All'
            )}
          </button>
        </div>
      </div>
      )}
      
        </div>
      );
    } else {
      // Render the complete table
      return (
        <div>
          
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">No Plate</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((obj, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{obj.pobj.no_plate}</td>
                  <td>{new Date(obj.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className={obj.flag === 'true' ? 'text-success' : 'text-danger'}>
                    {obj.flag === 'true' ? 'Paid' : 'Unpaid'}
                  </td>
                  <td>
                    <button
                      className={`btn btn-link toggle-button ${expandedIndex === index ? 'expanded' : ''}`}
                      onClick={() => handleToggleDetails(index)}
                    >
                      {expandedIndex === index ? (
                        <i className="bi bi-dash"></i>
                      ) : (
                        <i className="bi bi-plus"></i>
                      )}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">{renderAdditionalDetails(obj, index)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
      );
      
    }
  };

  return (
    <div >
      <MainNavbar />
      <Navbar2 />

      <div className="container mt-3" style={{marginLeft:'130px'}}>
        <div className="mb-3 d-flex justify-content-between align-items-center" style={{ marginLeft: '150px'}}>
          <div>
            <button
              className="btn btn-info"
              onClick={() => setShowUnpaidMemos(!showUnpaidMemos)}
            >
              Unpaid Memos
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary"
              // onClick={handleSearch}
            >
              Search
            </button>

             {/* Year Dropdown */}
             <select
              className="form-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">Select Year</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>

            </select>

            {/* Month Dropdown */}
            <select
              className="form-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={!selectedYear}
            >
             <option value="">Select Month</option>
            <option value="01">January</option>
  <option value="02">February</option>
  <option value="03">March</option>
  <option value="04">April</option>
  <option value="05">May</option>
  <option value="06">June</option>
  <option value="07">July</option>
  <option value="08">August</option>
  <option value="09">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
            </select>

          </div>
        </div>


        {renderTable()}
        <Modal show={showAlert} onHide={() => setShowAlert(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Emails Sent Successfully</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    The notification emails have been sent successfully.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowAlert(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
      </div>

      <Footer />
    </div>
  );
};

export default History;
