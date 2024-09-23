// Charts.jsx
import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const chartRef = useRef(null);

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Number of Product Categories',
        data: [50, 70, 45, 90, 65, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barDataYogurtPork = {
    labels: ['Cheese', 'Butter', 'Yoghurt', 'Fresh Milk', 'Egg', 'Meat - Beef', 'Meat - Chicken', 'Meat - Pork'],
    datasets: [
      {
        label: 'Products Sold',
        data: [120, 90, 200, 200, 80, 150, 130, 160],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barDataPlantation = {
    labels: ['Coconut', 'Timber', 'Nut'],
    datasets: [
      {
        label: 'Plantation Yield',
        data: [300, 250, 400],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Approved Animal and Plantation Products', 'Pending Animal and Plantation Products'],
    datasets: [
      {
        label: 'Applications Status',
        data: [200, 50],
        backgroundColor: ['#4BC0C0', '#FFCE56'],
        hoverBackgroundColor: ['#4BC0C0', '#FFCE56'],
      },
    ],
  };

  const pieData = {
    labels: ['Plantation and Animal Sell Products', 'Plantation and Animal Not Sell Product'],
    datasets: [
      {
        label: 'Plantation vs Animal',
        data: [300, 150],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true },
    },
  };

  const handlePrint = async () => {
    const input = document.getElementById('charts-container');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('charts.pdf');
  };

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '86D293' }}>
      <h2 style={{ textAlign: 'center' }}>Generate Plantation and Animal Monthly Report</h2>
      <hr style={{ margin: '20px 0', borderColor: '#00712D', borderWidth: '2px' }} />
      
      <div id="charts-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '48%' }}>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={barData} options={{ ...options, title: { ...options.plugins.title, text: 'Applications for Month' } }} />
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={barDataYogurtPork} options={{ ...options, title: { ...options.plugins.title, text: 'Products Sold (Cheese, Butter, Yoghurt, Fresh Milk, Egg, Meat)' } }} />
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={barDataPlantation} options={{ ...options, title: { ...options.plugins.title, text: 'Plantation Yields (Coconut, Timber, Nut)' } }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '38%' }}>
          <Doughnut data={doughnutData} options={{ ...options, title: { ...options.plugins.title, text: 'Approved vs Pending Applications' } }} />
          <Pie data={pieData} options={{ ...options, title: { ...options.plugins.title, text: 'Animal vs Plantation' } }} />
        </div>
      </div>

      <button 
        onClick={handlePrint} 
        style={{ marginTop: '20px', padding: '12px 20px', background: '#00712D', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Download Charts as PDF
      </button>
    </div>
  );
};

export default Charts;
