import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className='nbody'>
    <nav className="navbar">
      <ul className="nav-list">
        
        <li className="nav-item">
          <Link to="/orderhome" className="nav-link">
            Order Home
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addorder" className="nav-link">
            Add Order
          </Link>
        </li>
                
        <li className="nav-item">
          <Link to="/orderdetails" className="nav-link">
            Order Details
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/vieworder" className="nav-link">
            View Order
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/supplierdetails" className="nav-link">
            Suppliers
          </Link>
        </li>
        
      </ul>
    </nav>
    </div>
  );
}

export default Nav;