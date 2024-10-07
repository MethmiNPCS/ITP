import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import "./AddAnimal.css";

const ANIMAL_URL = "http://localhost:5000/animals"; // Endpoint for animals

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
      setErrorMessage(""); // Reset error message on input change
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
      return response.data.animal === null; // Ensure this condition is correct
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return true; // ID is unique if 404
      }
      console.error("Error checking animal ID:", error);
      return false; // Assume not unique for other errors
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
      <Nav />
      <br />
      <br/>
      <br/>
      <br/>
      <div className="animal-add-animal-container">
        
        <h1 className="animal-add-animal-header">Add Animal</h1>
        <br />
        <form onSubmit={handleSubmit} className="animal-add-animal-form">
          <label className="animal-add-animal-label">Animal ID</label>
          <input
            type="text"
            name="animalID"
            value={inputs.animalID}
            onChange={handleChange}
            required
            className="animal-add-animal-input"
          />
          {errorMessage && <div className="animal-error-message">{errorMessage}</div>}

          <br />

          <label className="animal-add-animal-label">Animal Type</label>
          <select
            name="animalType"
            value={inputs.animalType}
            onChange={handleChange}
            required
            className="animal-add-animal-select"
          >
            <option value="">Select Animal Type</option>
            <option value="Cow">Cow</option>
            <option value="Chicken">Chicken</option>
            <option value="Pig">Pig</option>
          </select>

          <br />

          <label className="animal-add-animal-label">Gender</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={inputs.gender === "Male"}
              onChange={handleChange}
              required
              className="animal-add-animal-radio"
            />
            <label htmlFor="male" className="animal-add-animal-radio-label">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={inputs.gender === "Female"}
              onChange={handleChange}
              className="animal-add-animal-radio"
            />
            <label htmlFor="female" className="animal-add-animal-radio-label">Female</label>
          </div>

          <br />

          <label className="animal-add-animal-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={inputs.dateOfBirth}
            onChange={handleChange}
            required
            className="animal-add-animal-input"
          />

          <br />

          <label className="animal-add-animal-label">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={inputs.weight}
            onChange={handleChange}
            className="animal-add-animal-input"
          />

          <br />

          <label className="animal-add-animal-label">Breeding Status</label>
          <input
            type="text"
            name="breedingStatus"
            value={inputs.breedingStatus}
            onChange={handleChange}
            className="animal-add-animal-input"
          />

          <br />

          <label className="animal-add-animal-label">Health Status</label>
          <select
            name="healthStatus"
            value={inputs.healthStatus}
            onChange={handleChange}
            required
            className="animal-add-animal-select"
          >
            <option value="">Select Health Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Injured">Injured</option>
          </select>

          <br />

          <label className="animal-add-animal-label">Health Condition</label>
          <input
            type="text"
            name="healthCondition"
            value={inputs.healthCondition}
            onChange={handleChange}
            className="animal-add-animal-input"
          />

          <br />

          <label className="animal-add-animal-label">Treatment Plan</label>
          <div className="animal-checkbox-group">
            {treatments.length > 0 ? (
              treatments.map((plan) => (
                <div key={plan.treatmentID} className="animal-checkbox-item">
                  <input
                    type="checkbox"
                    id={plan.treatmentID}
                    name="treatmentPlanIDs"
                    value={plan.treatmentID}
                    checked={inputs.treatmentPlanIDs.includes(plan.treatmentID)}
                    onChange={handleCheckboxChange}
                    className="animal-add-animal-checkbox"
                  />
                  <label htmlFor={plan.treatmentID} className="animal-add-animal-checkbox-label">
                    {plan.treatmentID} - {plan.planDescription}
                  </label>
                </div>
              ))
            ) : (
              <p className="animal-no-treatments">No treatments available</p>
            )}
          </div>

          <button type="submit" className="animal-submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddAnimal;
