import React from 'react';
import { useLocation } from 'react-router-dom';

function Salary() {
  const location = useLocation();
  const { BasicSalary } = location.state; // Destructure BasicSalary from the state

  // Calculate EPF, ETF, Bonus, and NetSalary (example calculations)
  const EPF = BasicSalary * 0.08; // Example: 8% of BasicSalary
  const ETF = BasicSalary * 0.03; // Example: 3% of BasicSalary
  const Bonus = BasicSalary * 0.1; // Example: 10% of BasicSalary
  const NetSalary = BasicSalary + Bonus - (EPF + ETF); // Net Salary calculation

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Salary Details</h2>
      <p>Basic Salary: {BasicSalary.toFixed(2)}</p>
      <p>EPF: {EPF.toFixed(2)}</p>
      <p>ETF: {ETF.toFixed(2)}</p>
      <p>Bonus: {Bonus.toFixed(2)}</p>
      <p className="font-semibold">Net Salary: {NetSalary.toFixed(2)}</p>
    </div>
  );
}

export default Salary;
