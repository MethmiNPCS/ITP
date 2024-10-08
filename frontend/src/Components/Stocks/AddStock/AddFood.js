import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router";
import axios from "axios";

function AddFood() {
  const history = useNavigate();
  const [foodinputs, setFoodInputs] = useState({
    stockID:"",
    name:"",
    animal:"",
    type:"Food",
    EXD:"",
    quantity:"",
    unitPrice:"",
    unit:"",
    instructions:""
  });

  const handleChange = (e) => {
    console.log('Changed field:', e.target.name, 'Value:', e.target.value);
    setFoodInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', foodinputs);
    sendRequest().then(() => history('/fooddetails'));
  };
  
  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/stocks", {
        stockID:foodinputs.stockID,
        name: foodinputs.name,
        animal: foodinputs.animal,
        type: foodinputs.type,
        EXD: new Date(foodinputs.EXD).toISOString(),
        quantity: Number(foodinputs.quantity),
        unitPrice: foodinputs.unitPrice,
        unit: foodinputs.unit,
        instructions: foodinputs.instructions,
      });
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data : error.message);
    }
  };
  
  return (
    <div className="pt-24">
      <Nav/> 
      <br/>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 bg-gray-200 rounded-lg shadow-lg">
        <h1 className="text-3xl text-gray-700 font-bold text-center mb-6">ADD NEW FOOD ITEM</h1>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Stock ID:</span>
          <input
            type="text"
            name="stockID"
            onChange={handleChange}
            value={foodinputs.stockID}
            placeholder="Enter Stock ID"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Name:</span>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={foodinputs.name}
            placeholder="Enter Food Item Name"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Animal:</span>
          <select
            name="animal"
            onChange={handleChange}
            value={foodinputs.animal}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          >
            <option value="" disabled>Select an Animal</option>
            <option value="Cow">Cow</option>
            <option value="Hen">Hen</option>
            <option value="Pig">Pig</option>
            <option value="Goat">Goat</option>
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Type:</span>
          <input
            type="text"
            name="type"
            value={foodinputs.type}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 cursor-not-allowed"
            readOnly
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Entry Date:</span>
          <input
            type="date"
            name="EXD"
            onChange={handleChange}
            value={foodinputs.EXD}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Quantity:</span>
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            value={foodinputs.quantity}
            placeholder="Enter the quantity"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            min="1" 
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Unit Price (In Rupees):</span>
          <input
            type="number"
            name="unitPrice"
            onChange={handleChange}
            value={foodinputs.unitPrice}
            placeholder="Enter Unit Price"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            step="0.01"
            min="0" 
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Unit:</span>
          <select
            name="unit"
            onChange={handleChange}
            value={foodinputs.unit}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
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

        <label className="block mb-6">
          <span className="text-gray-700 font-semibold">Instructions:</span>
          <textarea
            name="instructions"
            onChange={handleChange}
            value={foodinputs.instructions}
            placeholder="Type instructions here"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          ></textarea>
        </label>

        <div className="flex justify-center">
          <button
            type="submit"
            className="stockBtn w-full max-w-xs bg-green-500 text-white font-semibold py-3 rounded-md border border-green-400 hover:bg-green-600 transition duration-300"
          >
            ADD
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddFood;
