import React, {useState, useEffect} from 'react';
import Nav from '../Nav/Nav';
import './Orders.css';
import axios from "axios";
import Order from '../Order/Order';

const URL = "http://localhost:5000/orders";

const fetchHandler = async () =>{
  return await axios.get(URL).then((res) => res.data);
}

function Orders() {

  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    fetchHandler().then((data) => setOrders(data.orders));
  }, [])



  return (
    <div id="os-orders-container">
      <Nav />
      <br />
      <h1 id="os-orders-title">All Order Details</h1>
      <div id="os-orders-list">
        {orders && orders.map((order, i) => (
          <div key={i} id={`os-order-${i}`}>
            <Order order={order} orderId={order.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
