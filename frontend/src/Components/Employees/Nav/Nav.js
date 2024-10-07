import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        
        <li className="nav-item">
          <Link to="/employeehome" className="nav-link">
            Employee Home
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addemployee" className="nav-link">
            Add Employee
          </Link>
        </li>
                
        <li className="nav-item">
          <Link to="/employeedetails" className="nav-link">
            Employee Details
          </Link>

        </li>
        
      </ul>
    </nav>
  );
}

export default Nav;