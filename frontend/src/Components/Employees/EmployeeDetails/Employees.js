import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import Employee from '../Employee/Employee';
import { Link } from 'react-router-dom';

const URL = "http://localhost:5000/employees";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      setEmployees(data.employees || []);
    });
  }, []);

  return (
    <div style={styles.container}>
      <Nav />
      <h1 style={styles.header}>Employee Details</h1>
      <Link to="/salaries" style={styles.salaryLink}>
        <button style={styles.button}>View All Salaries</button>
      </Link>
      <div style={styles.employeeList}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div key={employee._id} style={styles.employeeCard}>
              <Employee employee={employee} />
              <Link to={`/salarycalculation/${employee.NIC}`} style={styles.salaryLink}>
                <button style={styles.button}>Calculate Salary</button>
              </Link>
            </div>
          ))
        ) : (
          <p style={styles.noEmployees}>No employees found</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f8ff',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  salaryLink: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  employeeList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  employeeCard: {
    width: '90%',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#A2CA71',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noEmployees: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
};

export default Employees;
