//import React from 'react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';


function Order(props) {
  const { orderID, orderType, items, description, orderDate, status, supplier} = props.order;
  const [supplierEmail, setSupplierEmail] = useState('');
  const history = useNavigate();

  useEffect(() => {
    const fetchSupplierEmail = async () => {
      try {
        // Use the complete backend URL
        const response = await axios.get(`http://localhost:5000/suppliers/supplier-email/${supplier}`);
        setSupplierEmail(response.data.email);
        // Pass supplierEmail back to the parent (ViewOrder.js)
        props.onEmailFetched(response.data.email);
      } catch (error) {
        console.error('Error fetching supplier email:', error);
        setSupplierEmail('Email not found');
      }
    };

    fetchSupplierEmail();
  }, [supplier]); // Dependency array ensures this runs when supplier changes

  
  return (
    <div id="o-order-container">
      <br />
      <h2 id="o-order-id" style={{ fontWeight: 'bold' }} >Order ID: {orderID}</h2>
      <h2 id="o-order-type">Order Type: {orderType}</h2>
      <h3 id="o-order-items-title">Order Items:</h3>
      <ul id="o-order-items-list">
        {items.map((item, index) => (
          <li key={index} id={`o-order-item-${index}`}>
            {item.orderItem} - Quantity: {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
      <h2 id="o-order-supplier">Supplier: {supplier}</h2>
      {/* <h2 id="o-order-supplieremail">Supplier Email: {supplierEmail}</h2>  Display the fetched email */}
      <h2 id="o-order-date">Order Date: {new Date(orderDate).toLocaleDateString()}</h2> {/* Format the date */}
      <h3 id="o-order-description">Description: {description}</h3>
      <h2 id="o-order-status">Status: {status}</h2>
    </div>
  );
}

export default Order;
