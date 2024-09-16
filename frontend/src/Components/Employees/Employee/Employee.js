import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

function Employee(props) {
  const { FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber } = props.employee;

  return (
    <div>
      <h2>Employee Display</h2>
      <br />
      <h3>Firstname: {FirstName}</h3>
      <h3>Lastname: {LastName}</h3>
      <h3>NIC No: {NIC}</h3>
      <h3>Gender: {Gender}</h3>
      <h3>Address: {Adress}</h3>
      <h3>Position: {Position}</h3>
      <h3>Contact Number: {ContactNumber}</h3>
      <br />
      {/* Correct usage of the Link component */}
      <Link to={`/employeedetails/${NIC}`}>
        <button>Update</button>
      </Link>
      <button>Delete</button>
    </div>
  );
}

export default Employee;
