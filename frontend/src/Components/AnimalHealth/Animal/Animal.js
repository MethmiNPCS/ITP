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
    dateOfBirth,
    weight,
    breedingStatus,
    healthStatus,
    healthCondition,
    treatmentIDs, 
  } = props.animal;

  const { treatments, refreshAnimals } = props; 
  const history = useNavigate();

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this animal?")) {
      await axios
        .delete(`http://localhost:5000/animals/${animalID}`)
        .then(() => {
          refreshAnimals(); // Refresh the animals list after deletion
          history("/animaldetails");
        });
    }
  };

  // Find treatment descriptions based on treatmentIDs
  const treatmentDescriptions = treatmentIDs.map(id => {
    const treatment = treatments.find(t => t.treatmentID === id);
    return treatment ? treatment.planDescription : "No description available";
  }).join(', ');

  return (
    <div className="animal-animal-container">
      <h1 className="animal-animal-heading" style={{ fontWeight: 'bold', fontSize: '24px' }}>Animal Details</h1>
      <div className="animal-animal-details">
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Animal ID:</strong> 
          <span className="animal-animal-detail-value">{animalID}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Animal Type:</strong> 
          <span className="animal-animal-detail-value">{animalType}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Gender:</strong> 
          <span className="animal-animal-detail-value">{gender}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Date of Birth:</strong> 
          <span className="animal-animal-detail-value">{new Date(dateOfBirth).toLocaleDateString()}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Weight:</strong> 
          <span className="animal-animal-detail-value">{weight}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Breeding Status:</strong> 
          <span className="animal-animal-detail-value">{breedingStatus}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Health Status:</strong> 
          <span className="animal-animal-detail-value">{healthStatus}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Health Condition:</strong> 
          <span className="animal-animal-detail-value">{healthCondition}</span>
        </div>
        <div className="animal-animal-detail">
          <strong className="animal-animal-detail-label">Treatment Plans:</strong> 
          <span className="animal-animal-detail-value">{treatmentDescriptions}</span>
        </div>
      </div>
      <div className="animal-animal-button-group">
        <Link to={`/animaldetails/${animalID}`}>
          <button className="animal-animal-button animal-update-button">Update</button>
        </Link>
        <button
          className="animal-animal-button animal-delete-button"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Animal;
