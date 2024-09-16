import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Order(props) {
  const { orderID, orderType, items, description, orderDate, status, supplier} = props.order;
  const history = useNavigate();

  
  return (
    <div>
      <br/>
      <h2>Order ID: {orderID}</h2>
      <h2>Order Type: {orderType}</h2>
      <h3>Order Items:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.orderItem} - Quantity: {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
      <h2>Supplier: {supplier}</h2> 
      <h2>Order Date: {new Date(orderDate).toLocaleDateString()}</h2> {/* Format the date */}
      <h3>Description: {description}</h3>
      <h2>Status: {status}</h2>
    </div>
  );
}

export default Order;
