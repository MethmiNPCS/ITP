import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router";
import axios from "axios";
import '../Stock.css';

function AddMedicine() {
  const history = useNavigate();
  const [medicineInputs, setMedicineInputs] = useState({
    stockID:"",
    name: "",
    animal: "",
    type: "Medicine",
    EXD: "",
    quantity: "",
    unitPrice:"",
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
        stockID:medicineInputs.stockID,
        name: medicineInputs.name,
        animal: medicineInputs.animal,
        type: medicineInputs.type,
        EXD: new Date(medicineInputs.EXD).toISOString(),
        quantity: Number(medicineInputs.quantity),
        unitPrice: medicineInputs.unitPrice,
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
      <form onSubmit={handleSubmit} className = "s-form mx-auto max-w-md p-5 bg-gray-100 rounded-lg shadow">
      <h1 className="text-4xl text-gray-700 font-bold text-center mb-4">ADD NEW MEDICINE</h1><br/>
        <label className="block mb-2">
            Stock ID:
            <input
              type="text"
              name="stockID"
              onChange={handleChange}
              value={medicineInputs.stockID}
              placeholder='Enter Stock ID'
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
              required
            />
        </label>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={medicineInputs.name}
            placeholder='Enter Medicine Name'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <br />
        <label className="block mb-2">
          Animal:
          <select
            name="animal"
            onChange={handleChange}
            value={medicineInputs.animal}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
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
        <label className="block mb-2">
          Type:
          <input
            type="text"
            name="type"
            value={medicineInputs.type}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            readOnly
          />
        </label>
        <br />
        <label className="block mb-2">
          Entry Date:
          <input
            type="date"
            name="EXD"
            onChange={handleChange}
            value={medicineInputs.EXD}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <br />
        <label className="block mb-2">
          Quantity:
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            value={medicineInputs.quantity}
            placeholder='Enter the quantity'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <br />
        <label className="block mb-2">
          Unit Price (In Rupees):
          <input
            type="text"
            name="unitPrice"
            onChange={handleChange}
            value={medicineInputs.unitPrice}
            placeholder='Enter Unit Price'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <label className="block mb-2">
          Unit:
          <select
            name="unit"
            onChange={handleChange}
            value={medicineInputs.unit}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
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
        <label className="block mb-2">
          Instructions:
          <textarea
            name="instructions"
            onChange={handleChange}
            value={medicineInputs.instructions}
            placeholder='Type instructions here'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          ></textarea>
        </label>
        <br />
        <button type="submit" className="s-add-button bg-green-500 text-white rounded-lg py-2 px-4 mt-4 hover:bg-green-600 transition duration-300">ADD</button>
      </form>
    </div>
  );
}

export default AddMedicine;
