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
            name: foodinputs.name,
            animal: foodinputs.animal,
            type: foodinputs.type,
            EXD: new Date(foodinputs.EXD).toISOString(),
            quantity: Number(foodinputs.quantity),
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
      <form onSubmit={handleSubmit}>
      <h1 className='centered-heading'>Update Food Details</h1>
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={foodinputs.name}
            placeholder='Enter Food Item Name'
            required
          />
        </label>
        <br />
        <label>
          Animal:
          <select
            name="animal"
            onChange={handleChange}
            value={foodinputs.animal}
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
            value={foodinputs.type}
            readOnly
          />
        </label>
        <br />
        <label>
          Expiration Date:
          <input
            type="date"
            name="EXD"
            onChange={handleChange}
            value={foodinputs.EXD}
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
            value={foodinputs.quantity}
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
            value={foodinputs.unit}
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
            value={foodinputs.instructions}
            placeholder='Type instructions here'
            required
          ></textarea>
        </label>
        <br />
        <button type="submit" className='add-button'>CONFIRM</button>
      </form>
    </div>
  );
}

export default UpdateFood;
