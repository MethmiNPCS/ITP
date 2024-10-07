import React, { useState, useRef } from 'react';
import Nav from '../Nav/Nav';
import './ViewOrder.css'

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Order from '../Order/Order'; 
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import OrderSummaryReport from '../OrderReport/OrderSummaryReport';


function ViewOrder() {
  const [orderID, setOrderID] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [supplierEmail, setSupplierEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const orderSummaryReportRef = useRef(); 

  const handleChange = (e) => {
    setOrderID(e.target.value);
    setError('');
    setOrderData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/orders/${orderID}`);
      setOrderData(response.data.order); 
      setError('');
    } catch (err) {
      setError('Incorrect Order ID entered');
      setOrderData(null);
    }
  };

  const deleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/orders/${orderID}`);
        navigate("/orderdetails"); // Redirect to order details page after deletion
      } catch (err) {
        setError('Failed to delete the order. Please try again.');
      }
    }
  };

  const sendEmail = async () => {
    // Confirm before proceeding
    const confirmSend = window.confirm("Are you sure you want to send the email to the supplier?");
    if (!confirmSend) {
      return; // Exit if the user chooses 'Cancel'
    }
  
    if (!supplierEmail) {
      alert('Supplier email is not available.');
      return;
    }
  
    try {
      // Send the email to the supplier
      await axios.post('http://localhost:5000/orderemails/send-email', {
        to: supplierEmail,
        order: orderData,  // Use supplierEmail captured from Order.js
      });
      alert('Email sent successfully!');

      // Update the order status to 'processed'
      await axios.patch(`http://localhost:5000/orders/update-status/${orderID}`);
      alert('Order status updated to processed!');
      
    } catch (error) {
      console.error('Error sending email or updating order status:', error);
      alert('Failed to send email or update order status.');
    }
};

  
  

  return (
    <div className='pt-20'>
    <div id="vview-order-container">
      <Nav />
      <br/><br/>
      <form id="vorder-id-form" onSubmit={handleSubmit}>
        <label id="vorder-id-label">Enter Order ID</label>
        <input
  id="vorder-id-input"
  type="text"
  value={orderID}
  onChange={handleChange}
  required
  style={{
    width: '400px',
    padding: '10px',
    border: '1px solid #2f2626',
    borderRadius: '5px',
    marginBottom: '15px'
  }}
/>

        <button id="vview-order-button" type="submit">View Order</button>
      </form>

      {error && <p id="vorder-error-message" style={{ color: 'red' }}>{error}</p>}

      {orderData && (
        <div id="vorder-details-card">
          <h2 id="vorder-details-header">Order Details</h2>
          

          <Order 
            order={orderData} 
            onEmailFetched={(email) => setSupplierEmail(email)}  // Capture supplierEmail here
          />

          <Link to={`/vieworder/${orderID}`}><button id="vupdate-order-button">Update</button></Link>
          
          <button id="vdelete-order-button" onClick={deleteHandler}>Delete</button>
          
          {/* Add ReactToPrint for generating and downloading the report */}
          <ReactToPrint
            trigger={() => <button id="vdownload-report-button">Download Order Summary Report</button>}
            content={() => orderSummaryReportRef.current}
            documentTitle={`Order_Summary_${orderData.orderID}`}
            pageStyle="print"
          />
          
          <div style={{ display: 'none' }}>
            <OrderSummaryReport
              ref={orderSummaryReportRef}
              order={orderData}
            />
          </div>
          <button id="vsend-to-supplier-button" onClick={sendEmail}>Send to Supplier</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default ViewOrder;
