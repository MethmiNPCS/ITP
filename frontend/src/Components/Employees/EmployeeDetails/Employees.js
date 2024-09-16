import React, { useState, useEffect } from 'react'; // Corrected hooks import
import Nav from '../Nav/Nav'; 
import axios from "axios";
import Employee from '../Employee/Employee';

const URL = "http://localhost:5000/employees";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Employees() {
  const [employees, setEmployees] = useState([]); // Corrected useState hook

  useEffect(() => {
    const fetchHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/employees/${id}`);
            setInputs(res.data.employee);
        } catch (error) {
            console.error("Error fetching employee:", error);
            // Optionally set an error state and display a user-friendly message
        }
    };
    fetchHandler();
}, [id]);


  return (
    <div>
      <Nav />
      <h1>Employee Details Display Page</h1>
      {employees.length > 0 ? (
        employees.map((employee) => (
          <Employee key={employee._id} employee={employee} />
        ))
      ) : (
        <p>No employees found</p>
      )}
    </div>



  );
}

export default Employees;
