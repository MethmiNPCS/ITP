import React, { useState, useEffect } from 'react';
import Nav from './Nav/Nav';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../Finance/F_Home.css'
// Import necessary Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const URL = "http://localhost:5000/finance";

function FinanceHome() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await axios.get(URL);
        const finances = response.data.finance || [];

        const income = finances.filter(item => item.transactionType === 'Income');
        const expense = finances.filter(item => item.transactionType === 'Expense');

        const calculatedIncome = income.reduce((sum, item) => sum + item.amount, 0);
        const calculatedExpense = expense.reduce((sum, item) => sum + item.amount, 0);

        setTotalIncome(calculatedIncome);
        setTotalExpense(calculatedExpense);

        // Setting up data for the bar graph
        setData({
          labels: ['Income', 'Expenses'],
          datasets: [
            {
              label: 'Total Amount',
              data: [calculatedIncome, calculatedExpense],
              backgroundColor: ['#4CAF50', '#F44336'],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    fetchFinanceData();
  }, []);

  return (
    <div>
      <Nav />
      <div style={{ width: '60%', margin: 'auto', padding: '20px' }}>
        <h2>Financial Overview</h2>
        <Bar data={data} />
      </div>
      <div className="con">
      <h2>Total Income: {totalIncome}</h2>
      <h2>Total Expense: {totalExpense}</h2>
      </div>
    </div>
  );
}

export default FinanceHome;
