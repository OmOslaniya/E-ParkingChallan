import React, { useState, useEffect } from "react";
import "./admincomponent.css";
import GenralComponent2 from "./GeneralComponent2";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from 'jwt-decode';
import { uname } from "./Signin";

const AdminComponent = (option) => {
  const [detailsData, setDetailsData] = useState([]);
  const [admins, setadmins] = useState([]);
  const [username, setUsername] = useState(null);
  const [sending, setSending] = useState(false); 
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetailsData, setshowDetailsData] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [addOfficerForm, setAddOfficerForm] = useState({
    stationName: "",
    password: "",
    username: "",
    email: "",
    Name:"",
  });

  const [addVehicleForm, setAddVehicleForm] = useState({
    name: "",
    vehicle_type:"",
    email: "",
    date_of_birth:"",
    no_plate:"",
    address:"",
  });
  const [selectedOption, setSelectedOption] = useState("single");
  const [showAddOfficerForm, setShowAddOfficerForm] = useState(false);

const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionClick = (section) => {
    // Update the selected section when a menu item is clicked
    setSelectedSection(section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddOfficerForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setAddVehicleForm((prevForm) => ({
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


  
  const handleSearch = async () => {
    try {
        console.log("enteeeerrr");
      if (searchUsername === "") {
        setadmins([]);
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/searchAdmin`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchUsername,
            }),
          }
        );
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setadmins(data);
        } else {
          setadmins([]);
        }
      }
    } catch (error) {
      console.error("Error searching officers:", error);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/removeadmin/${adminId}`,
        {
          method: "post",
        }
      );

      const data = await response.json();
      window.alert(data.message);
      fetchAdminDataToPrint();
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  const handleRemoveAllOfficer = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all admin data?"
      );
      if (confirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/removealladmin`,
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
        fetchAdminDataToPrint();
      }
    } catch (error) {
      console.error("Error removing all admins:", error);
    }
  };

  const fetchAdminDataToPrint = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admindata`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setadmins(data);
      } else {
        setadmins([]);
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

  

  const handleAddSingleAdmin = async () => {
    console.log("enter");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/addsingleadmin`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addOfficerForm,
        }),
      }
    );

    const data = await response.json();
    window.alert(data.message);
    setShowAddOfficerForm(false);
    fetchAdminDataToPrint();
  };

  const handleAddVehicle = async () => {

    if (
      !addVehicleForm.name ||
      !addVehicleForm.no_plate ||
      !addVehicleForm.email ||
      !addVehicleForm.vehicle_type ||
      !addVehicleForm.address ||
      !addVehicleForm.date_of_birth
    ) {
      window.alert("Please fill in all fields.");
      return;
    }
    
    console.log("enter");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/addvehicledetail`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addVehicleForm,
        }),
      }
    );

    const data = await response.json();
    window.alert(data.message);

    setAddVehicleForm({
        name: "",
        vehicle_type: "",
        email: "",
        date_of_birth: "",
        no_plate: "",
        address: "",
      });

    setShowAddOfficerForm(false);
    fetchAdminDataToPrint();
  };

  const handleHistoryClick = async (luser) => {
    console.log("officerusername "+luser);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchhistory`,
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
        `${process.env.REACT_APP_API_URL}/sendAnnouncementMailMainAdmin`,
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
        {option.option === "ManageAdmins" && (
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
          placeholder="Search by staion-name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showAddOfficerForm && (
        <div className="add-officer-form">
          <h3>Add Single Admin</h3>
          <form>
          <label>Admin Name:</label>
            <input
              type="text"
              name="Name"
              value={addOfficerForm.Name}
              onChange={handleInputChange}
            />
            <label>StationName:</label>
            <input
              type="text"
              name="stationName"
              value={addOfficerForm.stationName}
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
            <button type="button" onClick={handleAddSingleAdmin}>
              Add Admin
            </button>
          </form>
        </div>
      )}
      {admins.length === 0 ? (
        <p>No Admin found.</p>
      ) : (
        admins.map((officer, index) => (
          <div key={officer.username} className="officer-container">
            <div className="officer-header">
              <button
                onClick={() =>
                  setadmins((prevOfficers) =>
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
                onClick={() => handleRemoveAdmin(officer.username)}
                className="remove-button"
              > 
                Remove
              </button>
            </div>
            {officer.showDetails && (
              <div className="officer-details">
                <div>Station Name: {officer.stationName}</div>
                <div>Username: {officer.username}</div>
                <div>Password: {officer.password}</div>
                <div>Email: {officer.email}</div>
                
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
          Add Admin
        </button>
        <button
          className="show-officers-button"
          onClick={fetchAdminDataToPrint}
        >
          Show Admins
        </button>
      </div>
      {option.option === "AnnouncementMail" && (
        <GenralComponent2 option={(option = option.option)} />
      )}

    </>
        )}




{option.option === "RegisterVehicle" && (
    <>
     <h2>{option.option}</h2>
        <div className="add-vehicle-form">
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={addVehicleForm.name}
              onChange={handleInputChange2}
            />
            <label>Number Plate:</label>
            <input
              type="text"
              name="no_plate"
              value={addVehicleForm.no_plate}
              onChange={handleInputChange2}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={addVehicleForm.email}
              onChange={handleInputChange2}
            />
            <label>Vehicle Type:</label>
            <input
              type="text"
              name="vehicle_type"
              value={addVehicleForm.vehicle_type}
              onChange={handleInputChange2}
            />
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={addVehicleForm.address}
              onChange={handleInputChange2}
            />
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={addVehicleForm.date_of_birth}
              onChange={handleInputChange2}
            />

            <button type="button" onClick={handleAddVehicle}>
              Register Vehicle
            </button>
          </form>
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
            </div>          </div>
        
      

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

export default AdminComponent;
