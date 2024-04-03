import React, { useState, useEffect } from "react";
import "./generalComponent.css";
import GenralComponent2 from "./GeneralComponent2";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from 'jwt-decode';
import { uname } from "./Signin";

const GenralComponent = (option) => {
  const [detailsData, setDetailsData] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [sending, setSending] = useState(false); 
  const [username, setUsername] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [adminobj, setadminobj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsData, setshowDetailsData] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [expandedIndices, setExpandedIndices] = useState([]);
  const [addOfficerForm, setAddOfficerForm] = useState({
    name: "",
    password: "",
    username: "",
    email: "",
  });
  const [selectedOption, setSelectedOption] = useState("single");
  const [showAddOfficerForm, setShowAddOfficerForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddOfficerForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken'); 
    if (token) {
      const decodedToken = jwtDecode(token);
      const { username } = decodedToken.user;
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchUsername]);


  const fetchadmin = async (luser) => {
    
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchadmin`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uname,
        }),
      }
    );

    const data = await response.json();
    setadminobj(data);
  };

  useEffect(()=>{
    console.log("fetch admin data");
    console.log(uname);
    fetchadmin();
  },[]);
  
  const handleSearch = async () => {
    try {
      if (searchUsername === "") {
        setOfficers([]);
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/searchofficer`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchUsername, uname
            }),
          }
        );
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setOfficers(data);
        } else {
          setOfficers([]);
        }
      }
    } catch (error) {
      console.error("Error searching officers:", error);
    }
  };

  const handleRemoveOfficer = async (studentid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/removeofficer/${studentid}`,
        {
          method: "post",
        }
      );

      const data = await response.json();
      window.alert(data.message);
      fetchOfficerDataToPrint();
    } catch (error) {
      console.error("Error removing officer:", error);
    }
  };

  const handleRemoveAllOfficer = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all officer data?"
      );
      if (confirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/removeallofficer`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uname,
            }),
          }
          
        );

        const data = await response.json();
        window.alert(data.message);
        fetchOfficerDataToPrint();
      }
    } catch (error) {
      console.error("Error removing all officers:", error);
    }
  };

  const fetchOfficerDataToPrint = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/officerdataadmin`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setOfficers(data);
      } else {
        setOfficers([]);
      }
    } catch (error) {
      console.error("Error fetching officers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOfficer = () => {
    setShowAddOfficerForm(true);
  };

  

  const handleAddSingleOfficer = async () => {
    console.log("enter");
    console.log(adminobj.stationName);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/addsingleofficer`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addOfficerForm,adminobj
        }),
      }
    );

    const data = await response.json();
    window.alert(data.message);
    setShowAddOfficerForm(false);
    fetchOfficerDataToPrint();
  };

  const handleHistoryClick = async (luser) => {
    console.log("officerusername "+luser);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchAllMemos`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          luser,
        }),
      }
    );

    const data = await response.json();
    setDetailsData(data);
    setshowDetailsData(!showDetailsData);
    // setShowAddOfficerForm(false);
    // fetchOfficerDataToPrint();
  };

  const handleToggleDetails = (index) => {
    setExpandedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        // Remove index if already expanded
        return prevIndices.filter((i) => i !== index);
      } else {
       
        return [...prevIndices, index];
      }
    });
  };

  const handleAnnouncementTitleChange = (e) => {
    setAnnouncementTitle(e.target.value);
  };

  const handleAnnouncementBodyChange = (e) => {
    setAnnouncementBody(e.target.value);
  };

  const handleSendAnnouncement = async () => {
    const confirmed = window.confirm("Are you sure you want to send this announcement?");

    if (confirmed) {

    try {
      setSending(true); 

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/sendAnnouncementMailAdmin`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: announcementTitle,
            body: announcementBody,
          }),
        }
      );
  
      const data = await response.json();
      console.log(data);

      window.alert("Announcement Mail sent successfully!");
    } catch (error) {
      console.error("Error sending announcement:", error);
      window.alert("Failed to send announcement. Please try again later.");
    }finally {
      setSending(false); 
    }
  }
  };

  const Loader = () => (
    <div className="loader-overlay">
      <ClipLoader color="#3498db" loading={true} size={50} />
    </div>
  );
  
  return (
    <div className="container">

{option.option === "ManageOfficers" && (
  <>
      <h2>{option.option}</h2>
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      )}
      <div className="search-bar">
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Search by username"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showAddOfficerForm && (
        <div className="add-officer-form">
          <h3>Add Single Officer</h3>
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={addOfficerForm.name}
              onChange={handleInputChange}
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={addOfficerForm.password}
              onChange={handleInputChange}
            />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={addOfficerForm.username}
              onChange={handleInputChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={addOfficerForm.email}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleAddSingleOfficer}>
              Add Officer
            </button>
          </form>
        </div>
      )}
      {officers.length === 0 ? (
        <p>No officer found.</p>
      ) : (
        officers.map((officer, index) => (
          <div key={officer.username} className="officer-container">
            <div className="officer-header">
              <button
                onClick={() =>
                  setOfficers((prevOfficers) =>
                    prevOfficers.map((s) =>
                      s.username === officer.username
                        ? { ...s, showDetails: !s.showDetails }
                        : s
                    )
                  )
                }
              >
                {officer.showDetails ? "-" : "+"}
              </button>
              <div>
                {index + 1}. {officer.username}
              </div>
              <button
                onClick={() => handleRemoveOfficer(officer.username)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
            {officer.showDetails && (
              <div className="officer-details">
                <div>Officer Name: {officer.name}</div>
                <div>Username: {officer.username}</div>
                <div>Password: {officer.password}</div>
                <div>Email: {officer.email}</div>
                <button onClick={() => handleHistoryClick(officer.username)}>
                  History
                </button>
                {showDetailsData &&
                  detailsData.map((obj, index) => (
                    <div key={index} className="card mt-3 custom-card">
                      <div className="status-circle-wrapper">
                        <div
                          className={`status-circle ${
                            obj.flag === 'true' ? 'green' : 'red'
                          }`}
                        ></div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>No Plate:</strong> {obj.pobj.no_plate}
                        </p>
                        <p className="card-text">
                          <strong>Status:</strong>{' '}
                          {obj.flag === 'true' ? 'Paid' : 'Unpaid'}
                        </p>
                        {expandedIndices.includes(index) && (
                          <>
                            <p className="card-text">
                              <strong>Memo-Number:</strong> {obj.memo_number}
                            </p>
                            <p className="card-text">
                              <strong>Name:</strong> {obj.pobj.name}
                            </p>
                            <p className="card-text">
                              <strong>Address:</strong> {obj.pobj.address}
                            </p>
                            <p className="card-text">
                              <strong>Vehicle Type:</strong>{' '}
                              {obj.pobj.vehicle_type}
                            </p>
                            <p className="card-text">
                              <strong>MemoDate:</strong> {obj.date}
                            </p>
                            {obj.flag === 'true' && (
                              <>
                                <p className="card-text">
                                  <strong>Pay Date:</strong> {obj.status}
                                </p>
                              </>
                            )}
                          </>
                        )}
                        <button
                          className="btn btn-link"
                          onClick={() => handleToggleDetails(index)}
                        >
                          {expandedIndices.includes(index) ? 'Less' : 'More'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))
      )}
      <div className="action-buttons">
        <button
          className="remove-all-button"
          onClick={handleRemoveAllOfficer}
        >
          Remove All
        </button>
        <button className="add-officer-button" onClick={handleAddOfficer}>
          Add Officer
        </button>
        <button
          className="show-officers-button"
          onClick={fetchOfficerDataToPrint}
        >
          Show Officers
        </button>
      </div>
      
    
    </>
)}

{option.option === "AnnouncementMail" && (
    <>
     <h2>{option.option}</h2>
        <div className="announcement-form">
            <label>Title:</label>
            <textarea
              value={announcementTitle}
              onChange={handleAnnouncementTitleChange}
              placeholder="Enter announcement title..."
            />

            <label>Mail Body:</label>
            <textarea
              value={announcementBody}
              onChange={handleAnnouncementBodyChange}
              placeholder="Enter announcement mail body..."
            />

            <div className="button-container">
              <button className="announcement-button" onClick={handleSendAnnouncement} disabled={sending}>
                {sending ? 'Sending...' : 'Send Announcement'}
              </button>
              {sending && <Loader />}
            </div>

          </div>
        
      

    </>
        )}

{option.option === "DashBoard" && (
    <>
     <div className="default-content">
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Manage Officers and parking activities with ease!</p>
            <p>Select an option from the menu to get started!</p>
          </div>
      

    </>
        )}
</div>
  );
};

export default GenralComponent;
