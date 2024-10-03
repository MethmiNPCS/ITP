import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router";
import axios from "axios";
import '../Stock.css';

function AddMedicine() {
  const history = useNavigate();
  const [medicineInputs, setMedicineInputs] = useState({
    name: "",
    animal: "",
    type: "Medicine",
    EXD: "",
    quantity: "",
    unit: "",
    instructions: ""
  });

  const handleChange = (e) => {
    console.log('Changed field:', e.target.name, 'Value:', e.target.value);
    setMedicineInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', medicineInputs);
    sendRequest().then(() => history('/medicinedetails'));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/stocks", {
        name: medicineInputs.name,
        animal: medicineInputs.animal,
        type: medicineInputs.type,
        EXD: new Date(medicineInputs.EXD).toISOString(),
        quantity: Number(medicineInputs.quantity),
        unit: medicineInputs.unit,
        instructions: medicineInputs.instructions,
      });
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Nav/> 
      <br/>
      <form onSubmit={handleSubmit} className='s-form'>
      <h1 className='centered-heading'>Add New Medicine</h1><br/>
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={medicineInputs.name}
            placeholder='Enter Medicine Name'
            required
          />
        </label>
        <br />
        <label>
          Animal:
          <select
            name="animal"
            onChange={handleChange}
            value={medicineInputs.animal}
            required
          >
            <option value="" disabled>Select an Animal</option>
            <option value="Cow">Cow</option>
            <option value="Hen">Hen</option>
            <option value="Pig">Pig</option>
            <option value="Goat">Goat</option>
          </select>
        </label>
        <br />
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={medicineInputs.type}
            readOnly
          />
        </label>
        <br />
        <label>
          Entry Date:
          <input
            type="date"
            name="EXD"
            onChange={handleChange}
            value={medicineInputs.EXD}
            required
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            value={medicineInputs.quantity}
            placeholder='Enter the quantity'
            required
          />
        </label>
        <br />
        <label>
          Unit:
          <select
            name="unit"
            onChange={handleChange}
            value={medicineInputs.unit}
            required
          >
            <option value="" disabled>Select a Unit</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="g">Grams (g)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="oz">Ounces (oz)</option>
            <option value="l">Liters (l)</option>
            <option value="ml">Milliliters (ml)</option>
          </select>
        </label>
        <br />
        <label>
          Instructions:
          <textarea
            name="instructions"
            onChange={handleChange}
            value={medicineInputs.instructions}
            placeholder='Type instructions here'
            required
          ></textarea>
        </label>
        <br />
        <button type="submit" className='s-add-button'>ADD</button>
      </form>
    </div>
  );
}

export default AddMedicine;
