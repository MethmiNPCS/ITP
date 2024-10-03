import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import Nav from './Nav/Nav';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function StockHome() {
  const pieData = {
    labels: ['Food', 'Medicine'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const barData = {
    labels: ['Hen', 'Cow', 'Goat', 'Pig'],
    datasets: [
      {
        label: 'Animal Percentages',
        data: [25, 30, 20, 25],
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
          stepSize: 10,
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
