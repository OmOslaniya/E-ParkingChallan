import React, { useState,useEffect } from "react";
import './generalComponent2.css';

const GenralComponent2 = () => {

  const [emailBody, setEmailBody] = useState("");
  const [recipients, setRecipients] = useState("");


  const handleEmailBodyChange = (e) => {
    setEmailBody(e.target.value);
  };

  const handleRecipientsChange = (e) => {
    setRecipients(e.target.value);
  };

  const handleSendClick =async () => {
   

       if (emailBody && recipients) {
  
        try {
            console.log(emailBody);
            console.log(recipients);
          const response2 = await fetch(`${process.env.REACT_APP_API_URL}`+"/massemailsender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({emailBody,recipients }),
            
          });
          
          const data= await response2.json();

          window.alert(data.message);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

       

  };

  return (
    <div>
      
      <label className="To-field">
        <h2>AnnouncementMail</h2>
        To:
        <input
          type="text"
          value={recipients}
          onChange={handleRecipientsChange}
          placeholder="Enter recipients (e.g., Student, Faculty)"
        />
      </label>

      <label >
        <div className="Email-text">
        Email Body:
        </div>
        <textarea
          value={emailBody}
          onChange={handleEmailBodyChange}
          rows="4"
          cols="50"
        />
      </label>

    

      <button onClick={handleSendClick}>Send</button>

      {/* Placeholder for semester input field */}
     
    </div>
  );
};

export default GenralComponent2;