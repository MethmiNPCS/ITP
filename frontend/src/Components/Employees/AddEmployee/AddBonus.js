import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBonus() {
  const [bonusName, setBonusName] = useState('');
  const [position, setPosition] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddBonus = async () => {
    try {
      // Send the bonus data to the server to be processed
      await axios.post('http://localhost:5000/finance/add-bonus', {
        bonusName,
        position,
        bonusAmount,
      });

      navigate('/employees'); // Navigate back to Employees.js
    } catch (error) {
      console.error('Error adding bonus:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Bonus</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleAddBonus(); }}>
        <div className="mb-4">
          <label className="block mb-2">Bonus Name</label>
          <input
            type="text"
            value={bonusName}
            onChange={(e) => setBonusName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Select Position</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Bonus Amount</label>
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddBonus;
