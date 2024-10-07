// src/components/Charts.js

import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Nav from '../Nav/Nav';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = ({ productData }) => {
  // Define colors for the rotation using hexadecimal format
  const colorRotation = ['#006BFF', '#6EC207','#640D5F'];

  // Helper function to apply color rotation
  const getColorRotation = (index) => colorRotation[index % colorRotation.length];

  // Monthly product comparison
  const monthlyData = productData.reduce((acc, product) => {
    const month = new Date(product.MFD).toLocaleString('default', { month: 'long' });
    acc[month] = (acc[month] || 0) + product.quantity;
    return acc;
  }, {});

  const monthlyBarData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Number of Products',
        data: Object.values(monthlyData),
        backgroundColor: Object.keys(monthlyData).map((_, index) => getColorRotation(index)),
        borderColor: Object.keys(monthlyData).map((_, index) => getColorRotation(index)),
        borderWidth: 1,
      },
    ],
  };

  // Animal vs Plantation product comparison
  const typeData = productData.reduce(
    (acc, product) => {
      acc[product.type] = (acc[product.type] || 0) + product.quantity;
      return acc;
    },
    { Animal: 0, Plantation: 0 }
  );

  const typePieData = {
    labels: ['Animal', 'Plantation'],
    datasets: [
      {
        label: 'Product Types',
        data: [typeData.Animal, typeData.Plantation],
        backgroundColor: ['#F1F3C2', '#00917C'],
        hoverBackgroundColor: ['#F1F3C2', '#00917C'],
      },
    ],
  };

  // Animal product category comparison
  const animalData = productData
    .filter((product) => product.type === 'Animal')
    .reduce((acc, product) => {
      acc[product.product] = (acc[product.product] || 0) + product.quantity;
      return acc;
    }, {});

  const animalBarData = {
    labels: Object.keys(animalData),
    datasets: [
      {
        label: 'Animal Product Categories',
        data: Object.values(animalData),
        backgroundColor: Object.keys(animalData).map((_, index) => getColorRotation(index)),
        borderColor: Object.keys(animalData).map((_, index) => getColorRotation(index)),
        borderWidth: 1,
      },
    ],
  };

  // Plantation product category comparison
  const plantationData = productData
    .filter((product) => product.type === 'Plantation')
    .reduce((acc, product) => {
      acc[product.product] = (acc[product.product] || 0) + product.quantity;
      return acc;
    }, {});

  const plantationBarData = {
    labels: Object.keys(plantationData),
    datasets: [
      {
        label: 'Plantation Product Categories',
        data: Object.values(plantationData),
        backgroundColor: Object.keys(plantationData).map((_, index) => getColorRotation(index)),
        borderColor: Object.keys(plantationData).map((_, index) => getColorRotation(index)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }, // Disable the title display
    },
  };

  return (
    <div>
      <div>
        <div id="charts-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '48%' }}>
            <div style={{ width: '100%', height: '400px' }}>
              <Bar data={monthlyBarData} options={options} />
            </div>
            <div style={{ width: '100%', height: '400px' }}>
              <Bar data={animalBarData} options={options} />
            </div>
            <div style={{ width: '100%', height: '400px' }}>
              <Bar data={plantationBarData} options={options} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '38%' }}>
            <Pie data={typePieData} options={{ ...options, title: { display: true, text: 'Animal vs Plantation Products' } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
