import Nav from '../Nav/Nav';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const financeURL = "http://localhost:5000/finance";
const salaryURL = "http://localhost:5000/salaries";
const stockURL = "http://localhost:5000/stocks";
const productURL = "http://localhost:5000/products";

const Atabe = () => {
  const [financeByDate, setFinanceByDate] = useState({ income: {}, expense: {} });
  const [salaryByDate, setSalaryByDate] = useState({});
  const [stockByDate, setStockByDate] = useState({});
  const [productByDate, setProductByDate] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financeResponse = await axios.get(financeURL);
        const salaryResponse = await axios.get(salaryURL);
        const stockResponse = await axios.get(stockURL);
        const productResponse = await axios.get(productURL);

        // Process Finance data by date
        const financeData = financeResponse.data.finance || [];
        const incomeDateTotals = {};
        const expenseDateTotals = {};
        
        financeData.forEach(item => {
          const date = item.date || 'Unknown'; 
          const amount = item.amount || 0;

          // Separate totals based on transaction type
          if (item.transactionType === 'Income') {
            incomeDateTotals[date] = (incomeDateTotals[date] || 0) + amount; // Income
          } else if (item.transactionType === 'Expense') {
            expenseDateTotals[date] = (expenseDateTotals[date] || 0) + amount; // Expense
          }
        });

        setFinanceByDate({ income: incomeDateTotals, expense: expenseDateTotals });

        // Process Salary data by date
        const salaryData = salaryResponse.data.salaries || [];
        const salaryDateTotals = {};
        salaryData.forEach(item => {
          const date = item.date || 'Salary Payment';
          salaryDateTotals[date] = (salaryDateTotals[date] || 0) + item.totalSalary;
        });
        setSalaryByDate(salaryDateTotals);

        // Process Stock data by date
        const stockData = stockResponse.data.stocks || [];
        const stockDateTotals = {};
        stockData.forEach(item => {
          const date = item.date || 'Unknown';
          stockDateTotals[date] = (stockDateTotals[date] || 0) + item.totalPrice;
        });
        setStockByDate(stockDateTotals);

        // Process Product data by date
        const productData = productResponse.data.products || [];
        const productDateTotals = {};
        productData.forEach(item => {
          const date = item.date || 'Unknown';
          productDateTotals[date] = (productDateTotals[date] || 0) + item.totalValue;
        });
        setProductByDate(productDateTotals);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Function to format dates to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Combine the dates into a single array and make sure it's unique
  const allDates = Array.from(new Set([
    ...Object.keys(financeByDate.income),
    ...Object.keys(financeByDate.expense),
    ...Object.keys(salaryByDate),
    ...Object.keys(stockByDate),
    ...Object.keys(productByDate),
  ]));

  // Format the dates to dd/mm/yyyy
  const formattedDates = allDates.map(date => formatDate(date));

  // Prepare chart data for each date
  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Income',
        data: allDates.map(date => financeByDate.income[date] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36A2EB',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Expense',
        data: allDates.map(date => financeByDate.expense[date] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: '#FF6384',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Salary',
        data: allDates.map(date => salaryByDate[date] || 0),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: '#FFCE56',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Stock',
        data: allDates.map(date => stockByDate[date] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4BC0C0',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Product',
        data: allDates.map(date => productByDate[date] || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: '#9966FF',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Amounts by Date for Income, Expense, Salary, Stock, and Product',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Nav />
    
      <div className="home-container">
        <h1>Welcome to Finance Management Dashboard</h1>

        {/* Chart Section */}
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Navigation Links */}
        <div className="links-section">
          <Link to="/financedetails" className="link-button">View Expenses Details</Link>
          <Link to="/incomedetails" className="link-button">View Income Details</Link>
        </div>
      </div>
    </div>
  );
};

export default Atabe;
