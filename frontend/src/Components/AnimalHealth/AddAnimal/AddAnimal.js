import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import "./AddAnimal.css";

const ANIMAL_URL = "http://localhost:5000/animals"; 

function AddAnimal() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    animalID: "",
    animalType: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    weight: "",
    breedingStatus: "",
    healthStatus: "",
    healthCondition: "",
    treatmentPlanIDs: [],
  });

  const [treatments, setTreatments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/treatments");
        setTreatments(response.data.treatments || []);
      } catch (error) {
        console.error("There was an error fetching the treatments:", error);
      }
    };
    fetchTreatments();
  }, []);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "animalID") {
      setErrorMessage(""); 
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      treatmentPlanIDs: checked
        ? [...prevState.treatmentPlanIDs, value]
        : prevState.treatmentPlanIDs.filter((id) => id !== value),
    }));
  };

  const checkUniqueAnimalID = async (animalID) => {
    try {
      const response = await axios.get(`${ANIMAL_URL}/${animalID}`);
      return response.data.animal === null; 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return true; 
      }
      console.error("Error checking animal ID:", error);
      return false; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unique = await checkUniqueAnimalID(inputs.animalID);
    if (!unique) {
      setErrorMessage("Animal ID already exists. Please enter a new ID.");
      return;
    }

    await sendRequest();
    history("/animaldetails");
  };

  const sendRequest = async () => {
    await axios.post(ANIMAL_URL, {
      animalID: String(inputs.animalID),
      animalType: String(inputs.animalType),
      gender: String(inputs.gender),
      age: Number(inputs.age),
      dateOfBirth: new Date(inputs.dateOfBirth).toISOString(),
      weight: Number(inputs.weight),
      breedingStatus: String(inputs.breedingStatus),
      healthStatus: String(inputs.healthStatus),
      healthCondition: String(inputs.healthCondition),
      treatmentIDs: inputs.treatmentPlanIDs,
    });
  };

  return (
    <div>
      <div className="add-animal-container">
      <Nav />
        <h1>Add Animal</h1>
        <form onSubmit={handleSubmit}>
          <label>Animal ID</label>
          <input
            type="text"
            name="animalID"
            value={inputs.animalID}
            onChange={handleChange}
            required
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <label>Animal Type</label>
          <select
            name="animalType"
            value={inputs.animalType}
            onChange={handleChange}
            required
          >
            <option value="">Select Animal Type</option>
            <option value="Cow">Cow</option>
            <option value="Chicken">Chicken</option>
            <option value="Pig">Pig</option>
          </select>

          <label>Gender</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={inputs.gender === "Male"}
              onChange={handleChange}
              required
            />
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={inputs.gender === "Female"}
              onChange={handleChange}
            />
            <label htmlFor="female">Female</label>
          </div>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={inputs.dateOfBirth}
            onChange={handleChange}
            required
          />

          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={inputs.weight}
            onChange={handleChange}
          />

          <label>Breeding Status</label>
          <input
            type="text"
            name="breedingStatus"
            value={inputs.breedingStatus}
            onChange={handleChange}
          />

          <label>Health Status</label>
          <select
            name="healthStatus"
            value={inputs.healthStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Health Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Injured">Injured</option>
          </select>

          <label>Health Condition</label>
          <input
            type="text"
            name="healthCondition"
            value={inputs.healthCondition}
            onChange={handleChange}
          />

          <label>Treatment Plan</label>
          <div className="checkbox-group">
            {treatments.length > 0 ? (
              treatments.map((plan) => (
                <div key={plan.treatmentID}>
                  <input
                    type="checkbox"
                    id={plan.treatmentID}
                    name="treatmentPlanIDs"
                    value={plan.treatmentID}
                    checked={inputs.treatmentPlanIDs.includes(plan.treatmentID)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={plan.treatmentID}>
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
    </div>
  );
}

export default AddAnimal;
