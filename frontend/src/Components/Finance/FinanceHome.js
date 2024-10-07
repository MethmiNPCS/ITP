import '../Finance/F_Home.css';
import Nav from '../Finance/Nav/Nav';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Updated URL constants
const IncomeURL = "http://localhost:5000/finance";
const SalaryURL = "http://localhost:5000/employees"; // Updated URL
const StockURL = "http://localhost:5000/stocks";
const ProductURL = "http://localhost:5000/products";

const Home = () => {
  const [financeByCategory, setFinanceByCategory] = useState({});
  const [salaryByDepartment, setSalaryByDepartment] = useState({});
  const [stockByCategory, setStockByCategory] = useState({});
  const [productByCategory, setProductByCategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financeResponse = await axios.get(IncomeURL);
        const salaryResponse = await axios.get(SalaryURL);
        const stockResponse = await axios.get(StockURL);
        const productResponse = await axios.get(ProductURL);

        // Log data for debugging
        console.log('Finance Data:', financeResponse.data);  // Check finance data
        console.log('Salary Data:', salaryResponse.data);    // Check salary data
        console.log('Stock Data:', stockResponse.data);      // Check stock data
        console.log('Product Data:', productResponse.data);  // Check product data

        // Process Finance data by category
        const financeData = financeResponse.data.finance || [];
        const financeCategoryTotals = {};
        financeData.forEach(item => {
          const category = item.category || 'Unknown';
          financeCategoryTotals[category] = (financeCategoryTotals[category] || 0) + item.amount;
        });
        setFinanceByCategory(financeCategoryTotals);

        // Process Salary data by department
        const salaryData = salaryResponse.data.employees || []; // Ensure correct property
        const salaryDepartmentTotals = {};
        salaryData.forEach(item => {
          const department = item.Position || 'Unknown'; // Adjust based on the property you want
          salaryDepartmentTotals[department] = (salaryDepartmentTotals[department] || 0) + item.BasicSalary; // Adjust based on property
        });
        setSalaryByDepartment(salaryDepartmentTotals);

        // Process Stock data by category
        const stockData = stockResponse.data.stocks || [];
        const stockCategoryTotals = {};
        stockData.forEach(item => {
          const category = item.type || 'Unknown'; // Adjust based on the property
          stockCategoryTotals[category] = (stockCategoryTotals[category] || 0) + item.totalPrice;
        });
        setStockByCategory(stockCategoryTotals);

        // Process Product data by category
        const productData = productResponse.data.products || [];
        const productCategoryTotals = {};
        productData.forEach(item => {
          const category = item.type || 'Unknown'; // Adjust based on the property
          productCategoryTotals[category] = (productCategoryTotals[category] || 0) + item.quantity; // Adjust based on property
        });
        setProductByCategory(productCategoryTotals);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Combine the categories into a single array and make sure it's unique
  const allCategories = Array.from(new Set([
    ...Object.keys(financeByCategory),
    ...Object.keys(salaryByDepartment),
    ...Object.keys(stockByCategory),
    ...Object.keys(productByCategory),
  ]));

  // Prepare chart data for each category
  const chartData = {
    labels: allCategories,
    datasets: [
      {
        label: 'Finance',
        data: allCategories.map(category => financeByCategory[category] || 0),
        backgroundColor: '#FF6384',
      },
      {
        label: 'Salary',
        data: allCategories.map(category => salaryByDepartment[category] || 0),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Stock',
        data: allCategories.map(category => stockByCategory[category] || 0),
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Product',
        data: allCategories.map(category => productByCategory[category] || 0),
        backgroundColor: '#4BC0C0',
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
        text: 'Total Amounts by Category for Finance, Salary, Stock, and Product',
      },
    },
    scales: {
      x: {
        stacked: true, // Stack bars for each category
      },
      y: {
        stacked: true,
        beginAtZero: true, // Ensure the y-axis starts from 0
      },
    },
  };

  return (
    <div className="pt-12">
      <Nav />
      <div className="home-container">
        <h1>Welcome to Finance Management Dashboard</h1>

        {/* Chart Section */}
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
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

export default Home;
