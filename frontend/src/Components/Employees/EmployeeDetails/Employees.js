import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import Employee from '../Employee/Employee';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/employees";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchHandler();
        setEmployees(data.employees || []);
      } catch (error) {
        setError("Failed to fetch employee data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadEmployees();
  }, []);

  // Filter employees by NIC based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.NIC.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addBonusHandler = () => {
    navigate('/addbonus'); // Navigate to AddBonus.js
  };

  return (
    <div  >
      <Nav />
    <div class="pt-5">
    <div style={styles.container}>
      
      <div style={styles.actionContainer}>
        <input
          type="text"
          placeholder="Search by NIC"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={addBonusHandler} style={styles.button}>Add Bonus</button>
      </div>
      
      <h1 style={styles.header}>Employee Details</h1>
      {loading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.employeeList}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div key={employee._id} style={styles.employeeCard}>
                <Employee employee={employee} />
              </div>
            ))
          ) : (
            <p style={styles.noEmployees}>No employees found</p>
          )}
        </div>
      )}
    </div>
    </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '125px',
    backgroundColor: '#f0f8ff',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
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
    marginLeft: '10px', // Margin for spacing between input and button
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '70%',
    marginRight: '10px', // Margin for spacing between input and button
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
    backgroundColor: '#C1F2B0',
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

export default Employees;
