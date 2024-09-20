import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        
        <li className="nav-item">
          <Link to="/financehome" className="nav-link">
            Home
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addfinance" className="nav-link">
            Add Expense
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/financedetails" className="nav-link">
            Expense Details
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/incomedetails" className="nav-link">
            Income Details
          </Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default Nav;
