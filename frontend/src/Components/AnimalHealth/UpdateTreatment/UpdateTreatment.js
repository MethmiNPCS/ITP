import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import "./UpdateTreatment.css";

function UpdateTreatment() {
  const [inputs, setInputs] = useState({
    treatmentID: "",
    planDescription: "",
    startDate: "",
    endDate: "",
    treatmentTimes: [""], // Updated to an array for treatment times
    frequency: "",
    animalIDs: "",
    medicines: [{ name: "", dose: "" }],
  });

  const history = useNavigate();
  const { id: treatmentID } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/treatments/${treatmentID}`)
        .then((res) => res.data)
        .then((data) => {
          const medicinesArray = data.treatment.medicines.map((med) => ({
            name: med.name,
            dose: med.dose,
          }));

          setInputs({
            ...data.treatment,
            startDate: new Date(data.treatment.startDate)
              .toISOString()
              .split("T")[0],
            endDate: new Date(data.treatment.endDate)
              .toISOString()
              .split("T")[0],
            treatmentTimes: data.treatment.treatmentTime || [""], // Update to handle treatment times
            medicines: medicinesArray,
            animalIDs: data.treatment.animalIDs.join(", "),
          });
        });
    };
    fetchHandler();
  }, [treatmentID]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTreatmentTimeChange = (index, value) => {
    const updatedTimes = [...inputs.treatmentTimes];
    updatedTimes[index] = value;
    setInputs((prevState) => ({ ...prevState, treatmentTimes: updatedTimes }));
  };

  const addTreatmentTimeField = () => {
    setInputs((prevState) => ({
      ...prevState,
      treatmentTimes: [...prevState.treatmentTimes, ""],
    }));
  };

  const removeTreatmentTimeField = (index) => {
    const updatedTimes = inputs.treatmentTimes.filter((_, i) => i !== index);
    setInputs((prevState) => ({ ...prevState, treatmentTimes: updatedTimes }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...inputs.medicines];
    updatedMedicines[index][field] = value;
    setInputs((prevState) => ({ ...prevState, medicines: updatedMedicines }));
  };

  const addMedicineField = () => {
    setInputs((prevState) => ({
      ...prevState,
      medicines: [...prevState.medicines, { name: "", dose: "" }],
    }));
  };

  const removeMedicineField = (index) => {
    const updatedMedicines = inputs.medicines.filter((_, i) => i !== index);
    setInputs((prevState) => ({ ...prevState, medicines: updatedMedicines }));
  };

  const sendRequest = async () => {
    const animalIDsArray = inputs.animalIDs
      ? inputs.animalIDs.split(",").map((id) => id.trim())
      : [];

    await axios
      .put(`http://localhost:5000/treatments/${treatmentID}`, {
        treatmentID: String(inputs.treatmentID),
        planDescription: String(inputs.planDescription),
        startDate: new Date(inputs.startDate).toISOString(),
        endDate: new Date(inputs.endDate).toISOString(),
        treatmentTime: inputs.treatmentTimes, // Send as array
        frequency: String(inputs.frequency),
        animalIDs: animalIDsArray,
        medicines: inputs.medicines,
      })
      .then((res) => res.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history("/treatmentdetails"));
  };

  return (
    <div><Nav />
    <br/>
    <div className="treatment-update-treatment-container"> 
      <h1 className="treatment-update-treatment-title">Update Treatment</h1>
      <br />
      <form onSubmit={handleSubmit} className="treatment-update-treatment-form">
        <label className="treatment-form-label">Treatment ID</label>
        <input
          type="text"
          name="treatmentID"
          value={inputs.treatmentID}
          onChange={handleChange}
          className="treatment-form-input"
          readOnly
        />
        <br />
        <label className="treatment-form-label">Plan Description</label>
        <textarea
          name="planDescription"
          value={inputs.planDescription}
          onChange={handleChange}
          className="treatment-form-textarea"
          required
        />
        <br />
        <label className="treatment-form-label">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={inputs.startDate}
          onChange={handleChange}
          className="treatment-form-input"
          required
        />
        <br />
        <label className="treatment-form-label">End Date</label>
        <input
          type="date"
          name="endDate"
          value={inputs.endDate}
          onChange={handleChange}
          className="treatment-form-input"
          required
        />
        <br />
        <label className="treatment-form-label">Treatment Times</label>
        <div className="treatment-times-container">
          {inputs.treatmentTimes.map((time, index) => (
            <div key={index} className="treatment-time-field">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTreatmentTimeChange(index, e.target.value)}
                className="treatment-form-input"
                required
              />
              <button
                type="button"
                onClick={() => removeTreatmentTimeField(index)}
                className="treatment-remove-treatment-time-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTreatmentTimeField}
            className="treatment-add-treatment-time-button"
          >
            Add Treatment Time
          </button>
        </div>
        <br />
        <label className="treatment-form-label">Frequency</label>
        <input
          type="text"
          name="frequency"
          value={inputs.frequency}
          onChange={handleChange}
          className="treatment-form-input"
          required
        />
        <br />
        <label className="treatment-form-label">Animal IDs</label>
        <input
          type="text"
          name="animalIDs"
          value={inputs.animalIDs}
          onChange={handleChange}
          className="treatment-form-input"
          required
        />
        <br />
        <label className="treatment-form-label">Medicines</label>
        <div className="treatment-medicines-container">
          {inputs.medicines.map((med, index) => (
            <div key={index} className="treatment-medicine-field">
              <input
                type="text"
                placeholder="Medicine Name"
                value={med.name}
                onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                className="treatment-form-input"
                required
              />
              <input
                type="text"
                placeholder="Dose"
                value={med.dose}
                onChange={(e) => handleMedicineChange(index, "dose", e.target.value)}
                className="treatment-form-input"
                required
              />
              <button
                type="button"
                onClick={() => removeMedicineField(index)}
                className="treatment-remove-medicine-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicineField}
            className="treatment-add-medicine-button"
          >
            Add Medicine
          </button>
        </div>
        <br />
        <button type="submit" className="treatment-submit-button">
          Update Treatment
        </button>
      </form>
    </div>
    </div>
  );
}

export default UpdateTreatment;
