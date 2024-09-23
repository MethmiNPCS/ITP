import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function SalaryCalculation() {
  const { nic } = useParams();         
  const navigate = useNavigate(); // Define navigate here

  // Individual state variables for salary data
  const [baseSalary, setBaseSalary] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [deductions, setDeductions] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [payDate, setPayDate] = useState('');
  const [totalSalary, setTotalSalary] = useState(0);

  // Fetch salary data when component mounts or NIC changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPayDate(today);

    axios
      .get(`http://localhost:5000/salaries/${nic}`)
      .then((response) => {
        console.log('Fetched salary data:', response.data);
        if (response.data.salary) {
          const { 
            baseSalary = 0, 
            hoursWorked = 0, 
            overtimeHours = 0, 
            overtimeRate = 1.5, 
            deductions = 0, 
            bonuses = 0, 
            totalSalary = 0, 
            payDate: fetchedPayDate 
          } = response.data.salary;

          // Set individual state variables from the fetched data
          setBaseSalary(baseSalary);
          setHoursWorked(hoursWorked);
          setOvertimeHours(overtimeHours);
          setOvertimeRate(overtimeRate);
          setDeductions(deductions);
          setBonuses(bonuses);
          setPayDate(formatDate(fetchedPayDate) || today);
          setTotalSalary(totalSalary);
        } else {
          alert('Salary data not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching salary data:', error);
        alert('Error fetching salary data: ' + (error.response?.data?.message || error.message));
      });
  }, [nic]);

  // Recalculate total salary whenever relevant input fields change
  useEffect(() => {
    const overtimePay = overtimeHours * baseSalary * (overtimeRate || 1.5);
    const calculatedTotalSalary = (baseSalary * hoursWorked) + overtimePay + (parseFloat(bonuses) || 0) - (parseFloat(deductions) || 0);
    setTotalSalary(calculatedTotalSalary);
  }, [baseSalary, hoursWorked, overtimeHours, overtimeRate, deductions, bonuses]);

  // Format date to YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Input change handlers
  const handleBaseSalaryChange = (event) => setBaseSalary(parseFloat(event.target.value));
  const handleHoursChange = (event) => setHoursWorked(parseFloat(event.target.value));
  const handleOvertimeHoursChange = (event) => setOvertimeHours(parseFloat(event.target.value));
  const handleOvertimeRateChange = (event) => setOvertimeRate(parseFloat(event.target.value));
  const handleDeductionsChange = (event) => setDeductions(parseFloat(event.target.value));
  const handleBonusesChange = (event) => setBonuses(parseFloat(event.target.value));
  const handlePayDateChange = (event) => setPayDate(event.target.value);

  // Calculate and save salary to database
  const calculateAndSaveSalary = () => {
    if (baseSalary <= 0 || hoursWorked < 0 || deductions < 0 || bonuses < 0) {
      alert('Please ensure all fields are filled out correctly.');
      return;
    }

    const overtimePay = overtimeHours * baseSalary * (overtimeRate || 1.5);
    const calculatedTotalSalary = (baseSalary * hoursWorked) + overtimePay + (parseFloat(bonuses) || 0) - (parseFloat(deductions) || 0);

    const updatedSalaryData = {
      baseSalary,
      hoursWorked,
      overtimeHours,
      overtimeRate,
      deductions,
      bonuses,
      totalSalary: calculatedTotalSalary,
      payDate
    };

    console.log('Saving salary data:', updatedSalaryData);

    axios
      .put(`http://localhost:5000/salaries/${nic}`, updatedSalaryData)
      .then((response) => {
        console.log('Salary updated:', response.data);
        alert('Salary calculated and saved successfully!');
        navigate('/salaries'); // Use navigate to go back to the salaries page
      })
      .catch((error) => {
        console.error('Error updating salary:', error);
        alert('Error occurred while saving salary: ' + (error.response?.data?.message || error.message));
      });
  };

  // Generate and download a salary report PDF
  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Salary Report', 14, 22);

    doc.setFontSize(14);
    doc.text(`Employee NIC: ${nic}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [['Description', 'Amount']],
      body: [
        ['Base Salary', `LKR ${baseSalary.toFixed(2)}`],
        ['Hours Worked', hoursWorked],
        ['Overtime Hours', overtimeHours],
        ['Overtime Rate', overtimeRate],
        ['Overtime Pay', `LKR ${(overtimeHours * baseSalary * (overtimeRate || 1.5)).toFixed(2)}`],
        ['Bonuses', `LKR ${bonuses.toFixed(2)}`],
        ['Deductions', `LKR ${deductions.toFixed(2)}`],
        ['Total Salary', `LKR ${totalSalary.toFixed(2)}`],
        ['Pay Date', payDate]
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      styles: { fontSize: 12, fillColor: [204, 255, 204] },
      margin: { top: 35 },
    });

    doc.save('salary-report.pdf');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Salary Calculation</h1>
      <h2 style={styles.subHeader}>Employee NIC: {nic}</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Base Salary (LKR): 
          <input
            type="number"
            value={baseSalary}
            onChange={handleBaseSalaryChange}
            placeholder="Enter base salary"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Hours Worked: 
          <input
            type="number"
            value={hoursWorked}
            onChange={handleHoursChange}
            placeholder="Enter hours worked"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Overtime Hours: 
          <input
            type="number"
            value={overtimeHours}
            onChange={handleOvertimeHoursChange}
            placeholder="Enter overtime hours"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Overtime Rate: 
          <input
            type="number"
            value={overtimeRate}
            onChange={handleOvertimeRateChange}
            placeholder="Enter overtime rate (default 1.5)"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Deductions (LKR): 
          <input
            type="number"
            value={deductions}
            onChange={handleDeductionsChange}
            placeholder="Enter deductions"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Bonuses (LKR): 
          <input
            type="number"
            value={bonuses}
            onChange={handleBonusesChange}
            placeholder="Enter bonuses"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Pay Date: 
          <input
            type="date"
            value={payDate}
            onChange={handlePayDateChange}
            style={styles.input}
          />
        </label>
      </div>
     

      <Link to={'/salaries'}>
      <button onClick={calculateAndSaveSalary} style={styles.button}>Calculate and Save Salary</button>
      </Link>
      <button onClick={generateReport} style={styles.button}>Generate Report</button>
      <p style={styles.totalSalary}>Total Salary: LKR {totalSalary.toFixed(2)}</p>
    </div>
  );
}




const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#e0f7fa'
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    textAlign: 'center',
    color: '#555',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#00acc1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  totalSalary: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
  }
};
