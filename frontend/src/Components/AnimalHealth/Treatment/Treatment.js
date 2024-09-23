import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  
  const history = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/treatments/${treatmentID}`);
      history("/"); 
      history("/treatmentdetails"); 
    } catch (error) {
      console.error("There was an error deleting the treatment:", error);
    }
  };

  return (
    <div className="treatment-container">
      <h1 className="treatment-heading">Treatment Details</h1>
      <div className="treatment-details">
        <div className="treatment-detail">
          <strong>Treatment ID:</strong> {treatmentID}
        </div>
        <div className="treatment-detail">
          <strong>Plan Description:</strong> {planDescription}
        </div>
        <div className="treatment-detail">
          <strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}
        </div>
        <div className="treatment-detail">
          <strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}
        </div>
        <div className="treatment-detail">
          <strong>Treatment Time:</strong> {treatmentTime}
        </div>
        <div className="treatment-detail">
          <strong>Frequency:</strong> {frequency} 
        </div>
        <div className="treatment-detail">
          <strong>Animal IDs:</strong> {animalIDs.join(", ")}
        </div>

        <div className="medicines-container">
          <h3>Medicines:</h3>
          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-item">
              <div>
                <strong>Medicine Name:</strong> {medicine.name}
              </div>
              <div>
                <strong>Dose:</strong> {medicine.dose}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Link to={`/treatmentdetails/${treatmentID}`}>
          <button className="treatment-button update-button">Update</button>
        </Link>
        <button
          className="treatment-button delete-button"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Treatment;
