import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Treatment.css";

function Treatment(props) {
  const {
    treatmentID,
    planDescription,
    medicines,
    startDate,
    endDate,
    treatmentTime,
    animalIDs,
  } = props.treatment;

  const { onRefresh } = props; // Correctly destructure onRefresh

  const history = useNavigate();

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this treatment plan?")) {
      await axios
        .delete(`http://localhost:5000/treatments/${treatmentID}`)
        .then(() => {
          onRefresh(); // Call the refresh function correctly
          history("/treatmentdetails");
        });
    }
  };

  return (
    <div className="treatment-container">
      <h1 className="treatment-heading" style={{ fontWeight: 'bold', fontSize: '24px' }}>Treatment Details</h1>
      <div className="treatment-details">
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Treatment ID:</strong>
          <span className="treatment-detail-value">{treatmentID}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Plan Description:</strong>
          <span className="treatment-detail-value">{planDescription}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Start Date:</strong>
          <span className="treatment-detail-value">{new Date(startDate).toLocaleDateString()}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">End Date:</strong>
          <span className="treatment-detail-value">{new Date(endDate).toLocaleDateString()}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Treatment Time:</strong>
          <span className="treatment-detail-value">{treatmentTime.join(", ")}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Animal IDs:</strong>
          <span className="treatment-detail-value">{animalIDs.join(", ")}</span>
        </div>

        <div className="treatment-medicines-container">
          <h3 className="treatment-medicines-heading" style={{ fontWeight: 'bold' }}>Medicines:</h3>
          {medicines.map((medicine, index) => (
            <div key={index} className="treatment-medicine-item">
              <div className="medicine-name">
                <strong>Medicine Name:</strong> <span>{medicine.name}</span>
              </div>
              <div className="medicine-dose">
                <strong>Dose:</strong> <span>{medicine.dose}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="treatment-button-group">
        <Link to={`/treatmentdetails/${treatmentID}`}>
          <button className="treatment-button treatment-update-button">Update</button>
        </Link>
        <button className="treatment-button treatment-delete-button" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Treatment;
