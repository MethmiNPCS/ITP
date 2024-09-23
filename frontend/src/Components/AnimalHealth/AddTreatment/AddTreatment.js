import React, { useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import "./AddTreatment.css"

function AddTreatment() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    treatmentID: "",
    planDescription: "",
    startDate: "",
    endDate: "",
    treatmentTime: "",
    frequency: "",
    animalIDs: "",
  });

  const [medicines, setMedicines] = useState([{ name: "", dose: "" }]);

  const [errors, setErrors] = useState({
    treatmentID: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear error message when the user starts typing
    if (e.target.name === "treatmentID") {
      setErrors({ ...errors, treatmentID: "" });
    }
  };

  const handleMedicineChange = (index, e) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][e.target.name] = e.target.value;
    setMedicines(updatedMedicines);
  };

  // Add a new medicine input row
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dose: "" }]);
  };

  // Remove a medicine input row
  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  // Function to send the request to the backend
  const sendRequest = async () => {
    try {
      // Split animalIDs field and trim any whitespace
      const animalIDsArray = inputs.animalIDs
        ? inputs.animalIDs.split(",").map((id) => id.trim())
        : [];

      // Construct the payload
      const payload = {
        treatmentID: String(inputs.treatmentID),
        planDescription: String(inputs.planDescription),
        startDate: inputs.startDate
          ? new Date(inputs.startDate).toISOString()
          : null,
        endDate: inputs.endDate ? new Date(inputs.endDate).toISOString() : null,
        treatmentTime: String(inputs.treatmentTime),
        frequency: String(inputs.frequency),
        animalIDs: animalIDsArray,
        medicines,
      };

      console.log("Prepared payload:", payload); // Log the payload for debugging

      // Send the payload to the backend
      const response = await axios.post(
        "http://localhost:5000/treatments",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data); 
      history("/treatmentdetails");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors({
          ...errors,
          treatmentID:
            "Treatment ID already exists. Please choose a different ID.",
        });
      } else {
        console.error(
          "Error submitting treatment:",
          error.response?.data || error.message,
          error
        ); 
      }
    }
  };

  return (
    <div>
      <div className="add-treatment-container">
        <Nav />
        <h1>Add Treatment</h1>
        <form onSubmit={handleSubmit}>
          <label>Treatment ID</label>
          <input
            type="text"
            name="treatmentID"
            value={inputs.treatmentID}
            onChange={handleChange}
            required
          />
          {errors.treatmentID && (
            <div className="error-message">{errors.treatmentID}</div>
          )}

          <label>Plan Description</label>
          <textarea
            name="planDescription"
            value={inputs.planDescription}
            onChange={handleChange}
            required
          />

          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={inputs.startDate}
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={inputs.endDate}
            onChange={handleChange}
            required
          />

          <label>Treatment Time</label>
          <input
            type="text"
            name="treatmentTime"
            value={inputs.treatmentTime}
            onChange={handleChange}
          />

          <label>Frequency</label>
          <input
            type="text"
            name="frequency"
            value={inputs.frequency}
            onChange={handleChange}
          />

          <label>Medicines</label>
          {medicines.map((medicine, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder="Medicine name"
                value={medicine.name}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />
              <input
                type="text"
                name="dose"
                placeholder="Dose"
                value={medicine.dose}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />
              {medicines.length > 1 && (
                <button
                  type="button"
                  className="remove-medicine-button"
                  onClick={() => removeMedicine(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-medicine-button"
            onClick={addMedicine}
          >
            Add Medicine
          </button>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTreatment;
