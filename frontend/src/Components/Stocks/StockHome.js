import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import Nav from './Nav/Nav';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function StockHome() {
  const [stocks, setStocks] = useState([]);
  
  // Fetch stock data from the backend
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://localhost:5000/stocks"); // Ensure this URL matches your backend endpoint
        const data = await response.json();
        setStocks(data.stocks); // Update the state with fetched stocks
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  // Prepare data for Pie and Bar charts
  const pieData = {
    labels: ['Food', 'Medicine'],
    datasets: [
      {
        data: [
          stocks.filter(stock => stock.type === 'Food').length, // Count food items
          stocks.filter(stock => stock.type === 'Medicine').length // Count medicine items
        ],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const animalCounts = stocks.reduce((acc, stock) => {
    acc[stock.animal] = (acc[stock.animal] || 0) + 1; // Count by animal type
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(animalCounts), // Unique animal types
    datasets: [
      {
        label: 'Animal Percentages',
        data: Object.values(animalCounts), // Counts of each animal type
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0'],
        borderColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Adjust based on your data
        },
      },
    },
  };

  // Limit the pie chart size
  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center my-8">Stock Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart on the Left */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4 text-center">Animal Distribution</h2>
            <Bar data={barData} options={options} />
          </div>

          {/* Pie Chart on the Right */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4 text-center">Stock Distribution: Food vs Medicine</h2>
            <div className="h-80">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockHome;
