import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import Nav from "../Nav/Nav"; 
import "./UpdateAnimal.css"

const URL = "http://localhost:5000/treatments"; 

function UpdateAnimal() {
  const [inputs, setInputs] = useState({
    treatmentIDs: [],
  });
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const navigate = useNavigate();
  const { id: animalID } = useParams();

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/animals/${animalID}`);
        const animal = response.data.animal;
        console.log("Fetched animal data:", animal); 
        const formattedDateOfBirth = new Date(animal.dateOfBirth).toISOString().split('T')[0];
        setInputs({
          ...animal,
          dateOfBirth: formattedDateOfBirth,
          treatmentIDs: animal.treatmentIDs || [], 
        });
      } catch (error) {
        console.error("Error fetching animal:", error);
      }
    };

    const fetchTreatments = async () => {
      try {
        const response = await axios.get(URL);
        console.log("Fetched treatment plans:", response.data.treatments); // Debugging line
        setTreatmentPlans(response.data.treatments || []);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    };

    fetchAnimal();
    fetchTreatments();
  }, [animalID]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      treatmentIDs: checked
        ? [...prevState.treatmentIDs, value]
        : prevState.treatmentIDs.filter(id => id !== value),
    }));
  };

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/animals/${animalID}`, {
        animalID: String(inputs.animalID),
        animalType: String(inputs.animalType),
        gender: String(inputs.gender),
        age: Number(inputs.age),
        dateOfBirth: inputs.dateOfBirth,
        weight: Number(inputs.weight),
        breedingStatus: String(inputs.breedingStatus),
        healthStatus: String(inputs.healthStatus),
        healthCondition: String(inputs.healthCondition),
        treatmentIDs: inputs.treatmentIDs, // Include updated treatmentIDs
      });
      console.log("Animal updated successfully."); // Debugging line
    } catch (error) {
      console.error("Error updating animal:", error);
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate("/animaldetails"));
  };

  return (
    <div className="update-animal-container">
      <Nav /> 
      <h1 className="update-animal-header">Update Animal</h1>
      <form onSubmit={handleSubmit} className="update-animal-form">
        <label className="form-label">Animal ID</label>
        <input
          type="text"
          name="animalID"
          value={inputs.animalID || ""}
          onChange={handleChange}
          readOnly
          className="form-input"
        />
<br/>
        <label className="form-label">Animal Type</label>
        <select
          name="animalType"
          value={inputs.animalType || ""}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="Cow">Cow</option>
          <option value="Chicken">Chicken</option>
          <option value="Pig">Pig</option>
        </select>
        <br/>
        <label className="form-label">Gender</label>
        <div className="gender-radio-group">
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            checked={inputs.gender === "Male"}
            onChange={handleChange}
            required
            className="form-radio"
          />
          <label htmlFor="male" className="form-radio-label">Male</label>

          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            checked={inputs.gender === "Female"}
            onChange={handleChange}
            className="form-radio"
          />
          <label htmlFor="female" className="form-radio-label">Female</label>
        </div>
        <br/>
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={inputs.dateOfBirth || ""}
          onChange={handleChange}
          required
          className="form-input"
        />
<br/>
        <label className="form-label">Weight</label>
        <input
          type="number"
          name="weight"
          value={inputs.weight || ""}
          onChange={handleChange}
          className="form-input"
        />
<br/>
        <label className="form-label">Breeding Status</label>
        <input
          type="text"
          name="breedingStatus"
          value={inputs.breedingStatus || ""}
          onChange={handleChange}
          className="form-input"
        />
<br/>
        <label className="form-label">Health Status</label>
        <select
          name="healthStatus"
          value={inputs.healthStatus || ""}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="Healthy">Healthy</option>
          <option value="Sick">Sick</option>
          <option value="Injured">Injured</option>
        </select>
        <br/>
        <label className="form-label">Health Condition</label>
        <input
          type="text"
          name="healthCondition"
          value={inputs.healthCondition || ""}
          onChange={handleChange}
          className="form-input"
        />
<br/>
        <label className="form-label">Treatment Plans</label>
        <div className="checkbox-group">
          {treatmentPlans.length > 0 ? (
            treatmentPlans.map((plan) => (
              <div key={plan.treatmentID} className="checkbox-item">
                <input
                  type="checkbox"
                  id={plan.treatmentID}
                  name="treatmentIDs"
                  value={plan.treatmentID}
                  checked={inputs.treatmentIDs.includes(plan.treatmentID)}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <label htmlFor={plan.treatmentID} className="form-checkbox-label">
                  {plan.treatmentID} - {plan.planDescription}
                </label>
              </div>
            ))
          ) : (
            <p>No treatments available</p>
          )}
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default UpdateAnimal;
