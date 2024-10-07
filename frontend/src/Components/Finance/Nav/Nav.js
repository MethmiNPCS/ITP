import React from 'react';
import { Link } from "react-router-dom";
import BackToHome from '../../Home/BackToHome';

function Nav() {
  return (
    <nav className="bg-green-500 bg-opacity-0 backdrop-blur-md rounded-lg shadow-lg p-6 flex items-center fixed top-0 w-full z-50">
      
      {/* Left-aligned Back to Home button */
      <div className="flex-shrink-0">
        <BackToHome />
      </div>
      }
      {/* Spacer to push nav items to the center */}
      <div className="flex-grow"></div>

      {/* Centered navigation links */}
      <ul className="flex space-x-10 items-center">
        <li>
          <Link to="/financehome" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            DASHBOARD
          </Link>
        </li>

        <li>
          <Link to="/addfinance" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD FINANCE
          </Link>
        </li>

        <li>
          <Link to="/financedetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
          EXPENSE
          </Link>
        </li>

        <li>
          <Link to="/incomedetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            INCOME
          </Link>
        </li>

        <li>
          <Link to="/atable" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            MONTHLY INFORMATION
          </Link>
        </li>

        <li>
          <Link to="/pnl" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
          PROFIT & LOSSES
          </Link>
        </li>

      </ul>

      {/* Spacer to balance the layout */}
      <div className="flex-grow"></div>
    </nav>
  );
}

export default Nav;


/*
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
*/