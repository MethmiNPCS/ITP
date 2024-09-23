import React from 'react';
import axios from 'axios';
import './Order.css';
import { useNavigate } from 'react-router-dom';


function Order(props) {
  const { orderID, orderType, items, description, orderDate, status, supplier} = props.order;
  const history = useNavigate();

  
  return (
    <div id="o-order-container">
      <br />
      <h2 id="o-order-id">Order ID: {orderID}</h2>
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
      <h2 id="o-order-date">Order Date: {new Date(orderDate).toLocaleDateString()}</h2> {/* Format the date */}
      <h3 id="o-order-description">Description: {description}</h3>
      <h2 id="o-order-status">Status: {status}</h2>
    </div>
  );
}

export default Order;
