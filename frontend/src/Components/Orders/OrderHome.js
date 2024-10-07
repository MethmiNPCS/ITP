import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Nav from './Nav/Nav';
import './OrderHome.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

function OrderHome() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processedOrders, setProcessedOrders] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [foodOrders, setFoodOrders] = useState(0);
  const [medicineOrders, setMedicineOrders] = useState(0);
  const [foodSuppliers, setFoodSuppliers] = useState(0);
  const [medicineSuppliers, setMedicineSuppliers] = useState(0); 

  // Fetch order stats
  useEffect(() => {
    axios.get('http://localhost:5000/orders/stats')
      .then(response => {
        setTotalOrders(response.data.totalOrders);
        setPendingOrders(response.data.pendingOrders);
        setProcessedOrders(response.data.processedOrders);
      })
      .catch(error => console.error('Error fetching order stats:', error));
  }, []);

  // Fetch total suppliers count
  useEffect(() => {
    axios.get('http://localhost:5000/suppliers/count')
      .then(response => {
        console.log('Supplier count:', response.data.count);
        setTotalSuppliers(response.data.count); 
      })
      .catch(error => console.error('Error fetching total suppliers:', error));
  }, []);

  // Fetch category stats (Food and Medicine orders)
  useEffect(() => {
    axios.get('http://localhost:5000/orders/category-stats')
      .then(response => {
        setFoodOrders(response.data.foodOrders);
        setMedicineOrders(response.data.medicineOrders);
      })
      .catch(error => console.error('Error fetching category stats:', error));
  }, []);

  // Fetch supplier category counts
  useEffect(() => {
    axios.get('http://localhost:5000/suppliers/category-count')
      .then(response => {
        setFoodSuppliers(response.data.foodCount);
        setMedicineSuppliers(response.data.medicineCount);
      })
      .catch(error => console.error('Error fetching supplier category counts:', error));
  }, []);

  const doughnutData = {
    labels: ['Food Orders', 'Medicine Orders'],
    datasets: [
      {
        label: 'Order Categories',
        data: [foodOrders, medicineOrders],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const supplierDoughnutData = {
    labels: ['Food Suppliers', 'Medicine Suppliers'],
    datasets: [
      {
        label: 'Supplier Categories',
        data: [foodSuppliers, medicineSuppliers],
        backgroundColor: ['#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start', // Align legends
        display: true,
        labels: {
          usePointStyle: false, // Use point(circle) style for legends
        },
      },
    },
  };

  return (
    <div id="h-orderhome-container">
      <Nav />
      <div id="h-cover-photo" style={{ textAlign: 'center', position: 'relative' }}>
        {/* Cover photo */}
        <img 
          id="h-cover-image"
          src="/orderhomecover.png"
          alt="Order Dashboard" 
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
        {/* Overlay Text */}
        <h1 
          id="h-cover-title"
          style={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            color: 'white',
            fontSize: '2.5em',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' 
          }}
        >
          Order Management Dashboard
        </h1>
      </div>
      
      <br/>

      {/* Quick Stats Section */}
      <div 
        id="h-quick-stats"
        style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap' }}
      >
        <p id="h-total-orders"><strong>Total Orders Placed:</strong> {totalOrders}</p>
        <p id="h-pending-orders"><strong>Pending Orders:</strong> {pendingOrders}</p>
        <p id="h-processed-orders"><strong>Processed Orders:</strong> {processedOrders}</p>
        <p id="h-active-suppliers"><strong>Active Suppliers:</strong> {totalSuppliers}</p>
      </div>

      <br/>

      {/* Container for both donut charts */}
      <div id="h-donut-charts-container" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
        {/* Donut Chart for Orders */}
        <div id="h-order-donut-chart" style={{ maxWidth: '400px', height: '400px' }}>
          <h3 id="h-order-donut-title" style={{ textAlign: 'center', fontWeight: "bold", fontSize: 18 }}>Order Categories</h3>
          <Doughnut data={doughnutData} options={options} />
        </div>

        {/* Donut Chart for Suppliers */}
        <div id="h-supplier-donut-chart" style={{ maxWidth: '400px', height: '400px' }}>
          <h3 id="h-supplier-donut-title" style={{ textAlign: 'center', fontWeight: "bold", fontSize: 18 }}>Supplier Categories</h3>
          <Doughnut data={supplierDoughnutData} options={options} />
        </div>
      </div>
      
    </div>
  );
}

export default OrderHome;
