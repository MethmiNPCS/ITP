import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';

function AddBonus() {
  const [bonusName, setBonusName] = useState('');
  const [position, setPosition] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [positions, setPositions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employees/positions');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  const handleAddBonus = async () => {
    try {
      const response = await axios.post('http://localhost:5000/employees/add-bonus', {
        bonusName,
        position,
        bonusAmount: parseFloat(bonusAmount), // Convert to number
      });

      console.log("Bonus Added", response.data);
      navigate('/employeedetails');
    } catch (error) {
      console.error('Error adding bonus:', error);
    }
  };

  return (
    <div style={{
      width: '50%',
      margin: '40px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', color: '#333' }}>Add Bonus</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleAddBonus(); }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Bonus Name</label>
          <input
            type="text"
            value={bonusName}
            onChange={(e) => setBonusName(e.target.value)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
            required
          >
            <option value="" disabled>Select a position</option>
            {/* Adding specific positions */}
            <option value="Farm Manager">Farm Manager</option>
            <option value="Farm Owner">Farm Owner</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Task Manager">Task Manager</option>
            {/* Mapping through dynamic positions */}
            {positions.map((pos, index) => (
              <option key={index} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Bonus Amount</label>
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <button type="submit" style={{
          backgroundColor: '#3498db',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          width: '100%',
        }}
          onMouseEnter={e => e.target.style.backgroundColor = '#2980b9'}
          onMouseLeave={e => e.target.style.backgroundColor = '#3498db'}
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddBonus;
