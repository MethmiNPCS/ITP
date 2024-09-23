import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
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
    <div>
      <Nav /> 
      <div>
        <h1>Update Animal</h1>
        <br></br>
        <form onSubmit={handleSubmit}>
          <label>Animal ID</label>
          <br />
          <input
            type="text"
            name="animalID"
            value={inputs.animalID || ""}
            onChange={handleChange}
            readOnly
          />
          <br />
          <br />

          <label>Animal Type</label>
          <br />
          <select
            name="animalType"
            value={inputs.animalType || ""}
            onChange={handleChange}
            required
          >
            <option value="Cow">Cow</option>
            <option value="Chicken">Chicken</option>
            <option value="Pig">Pig</option>
          </select>
          <br />
          <br />

          <label>Gender</label>
          <br />
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
            <br />
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
          <br />
          <br />

          <label>Date of Birth</label>
          <br />
          <input
            type="date"
            name="dateOfBirth"
            value={inputs.dateOfBirth || ""}
            onChange={handleChange}
            required
          />
          <br />
          <br />

          <label>Weight</label>
          <br />
          <input
            type="number"
            name="weight"
            value={inputs.weight || ""}
            onChange={handleChange}
          />
          <br />
          <br />

          <label>Breeding Status</label>
          <br />
          <input
            type="text"
            name="breedingStatus"
            value={inputs.breedingStatus || ""}
            onChange={handleChange}
          />
          <br />
          <br />

          <label>Health Status</label>
          <br />
          <select
            name="healthStatus"
            value={inputs.healthStatus || ""}
            onChange={handleChange}
            required
          >
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Injured">Injured</option>
          </select>
          <br />
          <br />

          <label>Health Condition</label>
          <br />
          <input
            type="text"
            name="healthCondition"
            value={inputs.healthCondition || ""}
            onChange={handleChange}
          />
          <br />
          <br />

          <label>Treatment Plans</label>
          <br />
          <div className="checkbox-group">
            {treatmentPlans.length > 0 ? (
              treatmentPlans.map((plan) => (
                <div key={plan.treatmentID}>
                  <input
                    type="checkbox"
                    id={plan.treatmentID}
                    name="treatmentIDs"
                    value={plan.treatmentID}
                    checked={inputs.treatmentIDs.includes(plan.treatmentID)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={plan.treatmentID}>
                    {plan.treatmentID} - {plan.planDescription} {/* Display ID and description */}
                  </label>
                </div>
              ))
            ) : (
              <p>No treatments available</p>
            )}
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAnimal;
