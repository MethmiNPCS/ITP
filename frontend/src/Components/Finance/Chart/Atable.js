import Nav from '../Nav/Nav';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const IncomeURL = "http://localhost:5000/finance";
const SalaryURL = "http://localhost:5000/employees"; 
const StockURL = "http://localhost:5000/stocks";
const ProductURL = "http://localhost:5000/products";

const Atabe = () => {
  const [financeByDate, setFinanceByDate] = useState({ income: {}, expense: {} });
  const [salaryByDate, setSalaryByDate] = useState({});
  const [stockByDate, setStockByDate] = useState({});
  const [productByDate, setProductByDate] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financeResponse = await axios.get(IncomeURL);
        const salaryResponse = await axios.get(SalaryURL);
        const stockResponse = await axios.get(StockURL);
        const productResponse = await axios.get(ProductURL);

        // Process Finance data
        if (financeResponse.data.finance && Array.isArray(financeResponse.data.finance)) {
          const financeData = financeResponse.data.finance;
          const incomeDateTotals = {};
          const expenseDateTotals = {};
          financeData.forEach(item => {
            const date = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
            const amount = parseFloat(item.amount) || 0;
            if (item.transactionType === 'Income') {
              incomeDateTotals[date] = (incomeDateTotals[date] || 0) + amount;
            } else if (item.transactionType === 'Expense') {
              expenseDateTotals[date] = (expenseDateTotals[date] || 0) + amount;
            }
          });
          setFinanceByDate({ income: incomeDateTotals, expense: expenseDateTotals });
        }

        // Process Salary data
        const salaryData = salaryResponse.data || [];
        const salaryDateTotals = {};
        salaryData.forEach(item => {
          const date = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
          salaryDateTotals[date] = (salaryDateTotals[date] || 0) + item.NetSalary;
        });
        setSalaryByDate(salaryDateTotals);

        // Process Stock data
        const stockData = stockResponse.data || [];
        const stockDateTotals = {};
        stockData.forEach(item => {
          const date = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
          stockDateTotals[date] = (stockDateTotals[date] || 0) + item.totalPrice;
        });
        setStockByDate(stockDateTotals);

        // Process Product data
        const productData = productResponse.data || [];
        const productDateTotals = {};
        productData.forEach(item => {
          const date = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
          productDateTotals[date] = (productDateTotals[date] || 0) + item.totalValue;
        });
        setProductByDate(productDateTotals);

        // Log processed data for debugging
        console.log("Processed Finance Data:", financeByDate);
        console.log("Processed Salary Data:", salaryByDate);
        console.log("Processed Stock Data:", stockByDate);
        console.log("Processed Product Data:", productByDate);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  // Combine all dates from different datasets
  const allDates = Array.from(new Set([
    ...Object.keys(financeByDate.income),
    ...Object.keys(financeByDate.expense),
    ...Object.keys(salaryByDate),
    ...Object.keys(stockByDate),
    ...Object.keys(productByDate),
  ])).filter(date => date !== 'Unknown');

  const formattedDates = allDates.map(date => formatDate(date));

  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Other Income',
        data: allDates.map(date => financeByDate.income[date] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36A2EB',
        borderWidth: 2,
      },
      {
        label: 'Other Expense',
        data: allDates.map(date => financeByDate.expense[date] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: '#FF6384',
        borderWidth: 2,
      },
      {
        label: 'Salary',
        data: allDates.map(date => salaryByDate[date] || 0),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: '#FFCE56',
        borderWidth: 2,
      },
      {
        label: 'Stock',
        data: allDates.map(date => stockByDate[date] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4BC0C0',
        borderWidth: 2,
      },
      {
        label: 'Product',
        data: allDates.map(date => productByDate[date] || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: '#9966FF',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Total Amounts by Month and Year for Income, Expense, Salary, Stock, and Product' },
    },
    scales: {
      x: { type: 'category' },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="pt-12">
      <Nav />
      <div className="home-container">
        <h1>Welcome to Finance Management Dashboard</h1>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="links-section">
          <Link to="/financedetails" className="link-button">View Expenses Details</Link>
          <Link to="/incomedetails" className="link-button">View Income Details</Link>
        </div>
      </div>
    </div>
  );
};

export default Atabe;
