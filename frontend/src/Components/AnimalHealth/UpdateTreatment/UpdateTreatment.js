import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import "./UpdateTreatment.css"

function UpdateTreatment() {
  const [inputs, setInputs] = useState({
    treatmentID: "",
    planDescription: "",
    startDate: "",
    endDate: "",
    treatmentTime: "",
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
            medicines: medicinesArray,
            animalIDs: data.treatment.animalIDs.join(", "), // Join array to string
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
        treatmentTime: String(inputs.treatmentTime),
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
    <div className="add-animal-container"> 
      <Nav />
      <h1>Update Treatment</h1>
      <br></br>
      <form onSubmit={handleSubmit}>
        <label>Treatment ID</label>
        <input
          type="text"
          name="treatmentID"
          value={inputs.treatmentID}
          onChange={handleChange}
          readOnly
        />

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
        <div className="add-medicine-container">
          {inputs.medicines.map((medicine, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Medicine Name"
                value={medicine.name}
                onChange={(e) =>
                  handleMedicineChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Dose"
                value={medicine.dose}
                onChange={(e) =>
                  handleMedicineChange(index, "dose", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="remove-medicine-button"
                onClick={() => removeMedicineField(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-medicine-button"
          onClick={addMedicineField}
        >
          Add Medicine
        </button>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateTreatment;
