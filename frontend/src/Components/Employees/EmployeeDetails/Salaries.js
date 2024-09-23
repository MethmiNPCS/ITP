import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const URL = "http://localhost:5000/salaries";

export default function SalariesPage() {
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all salaries from the server when the component mounts
    axios
      .get(URL)
      .then((response) => {
        setSalaries(response.data.salaries || []);
      })
      .catch((error) => {
        console.error('Error fetching salaries:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSalaries = salaries.filter((salary) =>
    salary.employeeNIC && salary.employeeNIC.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Salary Report', 105, 20, { align: 'center' });

    const columns = [
      { title: 'Employee NIC', dataKey: 'employeeNIC' },
      { title: 'Base Salary', dataKey: 'baseSalary' },
      { title: 'Total Salary', dataKey: 'totalSalary' },
      { title: 'Overtime Hours', dataKey: 'overtimeHours' },
      { title: 'Overtime Rate', dataKey: 'overtimeRate' },
      { title: 'Deductions', dataKey: 'deductions' },
      { title: 'Bonuses', dataKey: 'bonuses' },
    ];

    const data = filteredSalaries.map((salary) => ({
      employeeNIC: salary.employeeNIC,
      baseSalary: `LKR ${salary.baseSalary.toFixed(2)}`,
      totalSalary: `LKR ${salary.totalSalary.toFixed(2)}`,
      overtimeHours: salary.overtimeHours || 'N/A',
      overtimeRate: `LKR ${salary.overtimeRate || 'N/A'}`,
      deductions: `LKR ${salary.deductions || 'N/A'}`,
      bonuses: `LKR ${salary.bonuses || 'N/A'}`,
    }));

    doc.autoTable({
      columns,
      body: data,
      startY: 30,
    });

    doc.save('Salary_Report.pdf');
  };

  const updateSalaries = () => {
    axios.get(URL)
      .then((response) => {
        setSalaries(response.data.salaries || []);
      })
      .catch((error) => {
        console.error('Error fetching updated salaries:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Employee Salaries</h1>
      <input
        type="text"
        placeholder="Search by NIC"
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />
      <button onClick={generatePDF} style={styles.button}>Generate Salary Report</button>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>Employee NIC</th>
            <th>Base Salary</th>
            <th>Total Salary</th>
            <th>Overtime Hours</th>
            <th>Overtime Rate</th>
            <th>Deductions</th>
            <th>Bonuses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.length > 0 ? (
            filteredSalaries.map((salary) => (
              <tr key={salary._id}>
                <td style={styles.tableCell}>{salary.employeeNIC}</td>
                <td style={styles.tableCell}>LKR {salary.baseSalary.toFixed(2)}</td>
                <td style={styles.tableCell}>LKR {salary.totalSalary.toFixed(2)}</td>
                <td style={styles.tableCell}>{salary.overtimeHours || 'N/A'}</td>
                <td style={styles.tableCell}>LKR {salary.overtimeRate || 'N/A'}</td>
                <td style={styles.tableCell}>LKR {salary.deductions || 'N/A'}</td>
                <td style={styles.tableCell}>LKR {salary.bonuses || 'N/A'}</td>
                <td style={styles.actionsCell}>
                  <Link to={`/salarycalculation/${salary.employeeNIC}`}>
                    <button style={styles.button} onClick={updateSalaries}>Update Salary</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={styles.tableCell}>No salaries found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles remain the same
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#e0f7fa',
  },
  tableHeader: {
    backgroundColor: '#b2dfdb',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  actionsCell: {
    textAlign: 'right',
  },
  button: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
