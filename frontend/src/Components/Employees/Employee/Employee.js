import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Employee({ employee }) {
  const { _id, FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber, BasicSalary, NetSalary} = employee;
  console.log(employee);
  const navigate = useNavigate(); // Initialize useNavigate

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
    navigate(`/updateemployeedetails/${_id}`); // Fixed template literal
  };

  const calculateSalaryHandler = () => {
    navigate("/salary", { state: { BasicSalary } }); // Pass BasicSalary to Salary.js
  };


  return (
    <div>
      <h2>Employee Display</h2>
      <br />
      <p>EmployeeID: {_id}</p>
      <p>Firstname: {FirstName}</p>
      <p>Lastname: {LastName}</p>
      <p>NIC No: {NIC}</p>
      <p>Gender: {Gender}</p>
      <p>Adress: {Adress}</p>
      <p>Position: {Position}</p>
      <p>Contact Number: {ContactNumber}</p>
      <p>Basic Salary: {BasicSalary}</p>
      <p>Net Salary: {NetSalary}</p>
      <br />
      <button onClick={deleteHandler}>Delete</button>
      <button onClick={updateHandler}>Update</button>
      <button onClick={calculateSalaryHandler}>Calculate Salary</button>
    </div>
  );
}

export default Employee;
