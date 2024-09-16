import React, {useState, useEffect} from 'react';
import Nav from '../Nav/Nav';
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
    <div>
      <Nav/>
      <br/>
      <h1>All Order Details</h1>
      <div>
        {orders && orders.map((order, i) => (
          <div key={i}>
            <Order order={order} orderId={order.id}/>
            </div>
        ))}
       
      </div>
    </div>
  );
}

export default Orders;
