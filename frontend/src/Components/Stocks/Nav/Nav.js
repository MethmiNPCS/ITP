import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        
        <li className="nav-item">
          <Link to="/Home" className="nav-link">
            HOME
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/stockhome" className="nav-link">
            DASHBOARD
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addfood" className="nav-link">
            ADD FOOD ITEM
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/fooddetails" className="nav-link">
            AVAILABLE FOODS
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/addmedicine" className="nav-link">
            ADD MEDICNE
          </Link>
        </li>
                
        <li className="nav-item">
          <Link to="/medicinedetails" className="nav-link">
            AVAILABLE MEDICINES
          </Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default Nav;
