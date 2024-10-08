import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import './Orders.css';
import axios from 'axios';
import Order from '../Order/Order';

const URL = 'http://localhost:5000/orders';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      setOrders(data.orders);
      setFilteredOrders(data.orders); // Initialize filteredOrders with all orders
    });
  }, []);

  useEffect(() => {
    // Filter orders based on the search term
    const results = orders.filter((order) => {
      return (
        (order.orderType.toLowerCase().includes(searchTerm.toLowerCase()) || 
         order.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  return (
    <div className='pt-24'>
    <div id="os-orders-container">
      <Nav />
      <br />
      <h1 id="os-orders-title">All Order Details</h1>

      <div style={{ display: 'flex' , justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Type or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            border: '2px solid #2f6b2f',
            borderRadius: '4px',
            width: '500px',
          }}
        />
      </div>

      <div id="os-orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <div key={i} id={`os-order-${i}`}>
              <Order order={order} orderId={order.id} />
            </div>
          ))
        ) : (
          <p style={{ color: 'red' }}>No search results found</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Orders;
