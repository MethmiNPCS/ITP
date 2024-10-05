import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addfinance" className="nav-link">
            Add Finances 
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

        <li className="nav-item">
          <Link to="/atable" className="nav-link">
            Monthly Information
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/pnl" className="nav-link">
            Profti and losses
          </Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default Nav;
