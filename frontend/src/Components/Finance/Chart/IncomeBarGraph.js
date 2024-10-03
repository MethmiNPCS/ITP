// IncomeBarGraph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const IncomeBarGraph = ({ financeData }) => {
  // Prepare data for the bar graph
  const categories = {};

  financeData.forEach(item => {
    if (item.transactionType === 'Income') {
      categories[item.category] = (categories[item.category] || 0) + item.amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Monthly Income by Category',
        data: Object.values(categories),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default IncomeBarGraph;
