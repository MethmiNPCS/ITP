import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams} from 'react-router';
import { useNavigate} from 'react-router';
import Nav from '../Nav/Nav';

function UpdateFood() {

    const [foodinputs, setFoodInputs] = useState({});
    const history = useNavigate();
    const id = useParams().id;

    useEffect(()=>{
        const fetchHandler = async()=>{
            await axios
            .get(`http://localhost:5000/stocks/${id}`)
            .then((res)=>res.data)
            .then((data)=> setFoodInputs(data.stock))
        };
        fetchHandler();
    },[id]);

    const sendRequest = async ()=>{
        await axios.put(`http://localhost:5000/stocks/${id}`,{
            stockID : foodinputs.stockID,
            name: foodinputs.name,
            animal: foodinputs.animal,
            type: foodinputs.type,
            EXD: new Date(foodinputs.EXD).toISOString(),
            quantity: Number(foodinputs.quantity),
            unitPrice: Number(foodinputs.unitPrice),
            unit: foodinputs.unit,
            instructions: foodinputs.instructions,
        })
        .then((res)=> res.data);
    };

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

  return (
    <div>
      <Nav/><br/>
      <form onSubmit={handleSubmit} className="s-form mx-auto max-w-md p-5 bg-gray-100 rounded-lg shadow">
      <h1 className="text-4xl text-gray-700 font-bold text-center mb-4">UPDATE FOOD DETAILS</h1><br/>
      <label className="block mb-2">
          Stock ID:
          <input
            type="text"
            name="stockID"
            onChange={handleChange}
            value={foodinputs.stockID}
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
            value={foodinputs.name}
            placeholder='Enter Food Item Name'
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
            value={foodinputs.animal}
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
            value={foodinputs.type}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            readOnly
          />
        </label>
        <br />
        <label className="block mb-2">
          Expiration Date:
          <input
            type="date"
            name="EXD"
            onChange={handleChange}
            value={foodinputs.EXD}
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
            value={foodinputs.quantity}
            placeholder='Enter the quantity'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <br />
        <label className="block mb-2">
          Unit Price:
          <input
            type="text"
            name="unitPrice"
            onChange={handleChange}
            value={foodinputs.unitPrice}
            placeholder='Enter Food Item Name'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          />
        </label>
        <label className="block mb-2">
          Unit:
          <select
            name="unit"
            onChange={handleChange}
            value={foodinputs.unit}
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
            value={foodinputs.instructions}
            placeholder='Type instructions here'
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
            required
          ></textarea>
        </label>
        <br />
        <button type="submit" className="s-add-button bg-green-500 text-white rounded-lg py-2 px-4 mt-4 hover:bg-green-600 transition duration-300">CONFIRM</button>
      </form>
    </div>
  );
}

export default UpdateFood;
