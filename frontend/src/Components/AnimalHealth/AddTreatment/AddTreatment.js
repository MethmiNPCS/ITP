import React, { useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import "./AddTreatment.css";

function AddTreatment() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    treatmentID: "",
    planDescription: "",
    startDate: "",
    endDate: "",
  });

  const [medicines, setMedicines] = useState([{ name: "", dose: "" }]);
  const [treatmentTimes, setTreatmentTimes] = useState([""]);
  const [errors, setErrors] = useState({
    treatmentID: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "treatmentID") {
      setErrors({ ...errors, treatmentID: "" });
    }
  };

  const handleMedicineChange = (index, e) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][e.target.name] = e.target.value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dose: "" }]);
  };

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleTreatmentTimeChange = (index, e) => {
    const updatedTimes = [...treatmentTimes];
    updatedTimes[index] = e.target.value;
    setTreatmentTimes(updatedTimes);
  };

  const addTreatmentTime = () => {
    setTreatmentTimes([...treatmentTimes, ""]);
  };

  const removeTreatmentTime = (index) => {
    const updatedTimes = treatmentTimes.filter((_, i) => i !== index);
    setTreatmentTimes(updatedTimes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  const sendRequest = async () => {
    try {
      const payload = {
        treatmentID: String(inputs.treatmentID),
        planDescription: String(inputs.planDescription),
        startDate: inputs.startDate
          ? new Date(inputs.startDate).toISOString()
          : null,
        endDate: inputs.endDate ? new Date(inputs.endDate).toISOString() : null,
        treatmentTime: treatmentTimes, // Send the array of treatment times
        medicines,
      };

      const response = await axios.post(
        "http://localhost:5000/treatments",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      history("/treatmentdetails");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors({
          ...errors,
          treatmentID: "Treatment ID already exists. Please choose a different ID.",
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
    <div><Nav /><br/><br/><br/>
    <br/>
    <div className="treatment-add-treatment-container">
      <h1 className="treatment-add-treatment-title">Add Treatment</h1>
      <form onSubmit={handleSubmit} className="treatment-add-treatment-form">
        <br />
        <label className="treatment-form-label">Treatment ID</label>
        <br />
        <input
          type="text"
          name="treatmentID"
          value={inputs.treatmentID}
          onChange={handleChange}
          required
          className="treatment-form-input"
        />
        {errors.treatmentID && (
          <div className="treatment-error-message">{errors.treatmentID}</div>
        )}
        <br />

        <label className="treatment-form-label">Plan Description</label>
        <br />
        <textarea
          name="planDescription"
          value={inputs.planDescription}
          onChange={handleChange}
          required
          className="treatment-form-textarea"
        />
        <br />

        <label className="treatment-form-label">Start Date</label>
        <br />
        <input
          type="date"
          name="startDate"
          value={inputs.startDate}
          onChange={handleChange}
          required
          className="treatment-form-input"
        />
        <br />

        <label className="treatment-form-label">End Date</label>
        <br />
        <input
          type="date"
          name="endDate"
          value={inputs.endDate}
          onChange={handleChange}
          required
          className="treatment-form-input"
        />
        <br />

        <label className="treatment-form-label">Treatment Time(s)</label>
        <br />
        {treatmentTimes.map((time, index) => (
          <div key={index} className="treatment-time-input-group">
            <input
              type="time"
              name="treatmentTime"
              value={time}
              onChange={(e) => handleTreatmentTimeChange(index, e)}
              className="treatment-form-input"
              required
            />
            {treatmentTimes.length > 1 && (
              <button
                type="button"
                className="treatment-remove-time-button"
                onClick={() => removeTreatmentTime(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="treatment-add-time-button"
          onClick={addTreatmentTime}
        >
          Add Treatment Time
        </button>
        <br />

        <label className="treatment-form-label">Medicines</label>
        <br />
        {medicines.map((medicine, index) => (
          <div key={index} className="treatment-medicine-group">
            <input
              type="text"
              name="name"
              value={medicine.name}
              onChange={(e) => handleMedicineChange(index, e)}
              className="treatment-form-input"
              placeholder="Medicine Name"
              required
            />
            <input
              type="text"
              name="dose"
              value={medicine.dose}
              onChange={(e) => handleMedicineChange(index, e)}
              className="treatment-form-input"
              placeholder="Dose"
              required
            />
            {medicines.length > 1 && (
              <button
                type="button"
                className="treatment-remove-medicine-button"
                onClick={() => removeMedicine(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="treatment-add-medicine-button"
          onClick={addMedicine}
        >
          Add Medicine
        </button>
        <br />

        <button type="submit" className="treatment-submit-button">
          Submit
        </button>
      </form>
    </div>
    </div>
  );
}

export default AddTreatment;
