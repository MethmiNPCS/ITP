import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Animal.css"; 

function Animal(props) {
  const {
    animalID,
    animalType,
    gender,
    age,
    dateOfBirth,
    weight,
    breedingStatus,
    healthStatus,
    healthCondition,
    treatmentIDs, 
  } = props.animal;

  const { treatments } = props; 
  const history = useNavigate();

  const deleteHandler = async () => {
    await axios
      .delete(`http://localhost:5000/animals/${animalID}`)
      .then((res) => res.data)
      .then(() => history("/"))
      .then(() => history("/animaldetails"));
  };

  // Debug: Log treatmentIDs and treatments
  console.log("Treatment IDs:", treatmentIDs);
  console.log("Treatments Data:", treatments);

  // Find treatment descriptions based on treatmentIDs
  const treatmentDescriptions = treatmentIDs.map(id => {
    const treatment = treatments.find(t => t.treatmentID === id);
    return treatment ? treatment.planDescription : "No description available";
  }).join(', ');

  return (
    <div className="animal-container">
      <h1 className="animal-heading">Animal Details</h1>
      <div className="animal-details">
        <div className="animal-detail">
          <strong>Animal ID:</strong> {animalID}
        </div>
        <div className="animal-detail">
          <strong>Animal Type:</strong> {animalType}
        </div>
        <div className="animal-detail">
          <strong>Gender:</strong> {gender}
        </div>
        <div className="animal-detail">
          <strong>Date of Birth:</strong> {new Date(dateOfBirth).toLocaleDateString()}
        </div>
        <div className="animal-detail">
          <strong>Weight:</strong> {weight}
        </div>
        <div className="animal-detail">
          <strong>Breeding Status:</strong> {breedingStatus}
        </div>
        <div className="animal-detail">
          <strong>Health Status:</strong> {healthStatus}
        </div>
        <div className="animal-detail">
          <strong>Health Condition:</strong> {healthCondition}
        </div>
        <div className="animal-detail">
          <strong>Treatment Plans:</strong> {treatmentDescriptions}
        </div>
      </div>
      <div>
        <Link to={`/animaldetails/${animalID}`}>
          <button className="animal-button update-button">Update</button>
        </Link>
        <button
          className="animal-button delete-button"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Animal;
