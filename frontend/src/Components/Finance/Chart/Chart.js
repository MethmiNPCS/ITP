// BarGraphPage.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const URL = "http://localhost:5000/finance";

const BarGraphPage = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await axios.get(URL);
        const finances = response.data.finance || [];

        const income = finances.filter(item => item.transactionType === 'Income');
        const expense = finances.filter(item => item.transactionType === 'Expense');

        const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expense.reduce((sum, item) => sum + item.amount, 0);

        setData({
          labels: ['Income', 'Expenses'],
          datasets: [
            {
              label: 'Total Amount',
              data: [totalIncome, totalExpense],
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
      <h1>Financial Overview</h1>
      <Bar data={data} />
    </div>
  );
};

export default BarGraphPage;
