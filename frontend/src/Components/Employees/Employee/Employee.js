import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Employee({ employee }) {
  const {
    _id, FirstName, LastName, NIC, Gender, Adress, Position, 
    ContactNumber, BasicSalary, NetSalary, Bonus, AddDate
  } = employee;

  const navigate = useNavigate();

  const deleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      await axios.delete(`http://localhost:5000/employees/${_id}`)
        .then(res => res.data)
        .then(() => navigate("/"))
        .then(() => navigate("/EmployeeDetails"));
    }
  };

  const updateHandler = () => {
    navigate(`/updateemployeedetails/${_id}`);
  };

  const calculateSalaryHandler = () => {
    navigate("/salary", { state: { BasicSalary, Bonus } });
  };

  return (
    <div style={{
      width: '60%',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Employee Display</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Employee ID:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{_id}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>First Name:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{FirstName}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Last Name:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{LastName}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>NIC No:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{NIC}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Gender:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Gender}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Address:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Adress}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Position:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Position}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Contact Number:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ContactNumber}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Basic Salary:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{BasicSalary}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Net Salary:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{NetSalary}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>Date Added:</strong></td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(AddDate).toISOString().split('T')[0]}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={deleteHandler}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={e => e.target.style.backgroundColor = '#e74c3c'}
        >
          Delete
        </button>
        <button
          onClick={updateHandler}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#2980b9'}
          onMouseLeave={e => e.target.style.backgroundColor = '#3498db'}
        >
          Update
        </button>
        <button
          onClick={calculateSalaryHandler}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#27ae60'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2ecc71'}
        >
          Calculate Salary
        </button>
      </div>
    </div>
  );
}

export default Employee;
