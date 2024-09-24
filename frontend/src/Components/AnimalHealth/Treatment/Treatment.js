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
    frequency,
    animalIDs,
  } = props.treatment;

  const { refreshTreatment } = props; // Correctly get refreshTreatment from props

  const history = useNavigate();

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this treatment plan?")) {
      await axios
        .delete(`http://localhost:5000/treatments/${treatmentID}`)
        .then(() => {
          refreshTreatment(); // Call the refresh function
          history("/treatmentdetails");
        });
    }
  };

  return (
    <div className="treatment-container">
      <h1 className="treatment-heading">Treatment Details</h1>
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
          <span className="treatment-detail-value">{treatmentTime}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Frequency:</strong> 
          <span className="treatment-detail-value">{frequency}</span>
        </div>
        <div className="treatment-detail">
          <strong className="treatment-detail-label">Animal IDs:</strong> 
          <span className="treatment-detail-value">{animalIDs.join(", ")}</span>
        </div>

        <div className="medicines-container">
          <h3 className="medicines-heading">Medicines:</h3>
          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-item">
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
          <button className="treatment-button update-button">Update</button>
        </Link>
        <button className="treatment-button delete-button" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Treatment;
