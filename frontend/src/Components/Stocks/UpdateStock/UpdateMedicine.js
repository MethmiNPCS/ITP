import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import Nav from '../Nav/Nav';

function UpdateMedicine() {
  const [medicineInputs, setMedicineInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/stocks/${id}`)
        .then((res) => res.data)
        .then((data) => setMedicineInputs(data.stock));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/stocks/${id}`, {
      stockID : medicineInputs.stockID,
      name: medicineInputs.name,
      animal: medicineInputs.animal,
      type: medicineInputs.type,
      EXD: new Date(medicineInputs.EXD).toISOString(),
      quantity: Number(medicineInputs.quantity),
      unitPrice: Number(medicineInputs.unitPrice),
      unit: medicineInputs.unit,
      instructions: medicineInputs.instructions,
    })
    .then((res) => res.data);
  };

  const handleChange = (e) => {
    setMedicineInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history('/medicinedetails'));
  };

  return (
    <div>
      <Nav /><br />
      <form onSubmit={handleSubmit} className='s-form'>
        <h1 className='centered-heading'>Update Medicine Details</h1>
        <label>
          Stock ID:
          <input
            type="text"
            name="stockID"
            onChange={handleChange}
            value={medicineInputs.stockID}
            placeholder='Enter Medicine ID'
            required
          />
        </label>
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
          Expiration Date:
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
          Unit Price:
          <input
            type="text"
            name="unitPrice"
            onChange={handleChange}
            value={medicineInputs.unitPrice}
            placeholder='Enter Unit Price '
            required
          />
        </label>
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
        <button type="submit" className='s-add-button'>CONFIRM</button>
      </form>
    </div>
  );
}

export default UpdateMedicine;
