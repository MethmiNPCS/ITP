import React from 'react';
import './Nav.css'; 
import { Link } from "react-router-dom";
//import Nav from '../Nav/Nav';


function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">


        
        <li className="nav-item">
          <Link to="/producthome" className="nav-link">
            Product Home
          </Link>
        </li>
               
        <li className="nav-item">
          <Link to="/addproduct" className="nav-link">
            Add Product
          </Link>
        </li>
                
        <li className="nav-item">
          <Link to="/productdetails" className="nav-link">
            Product Details
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/chart" className="nav-link">
          Chart
          </Link>
        </li>
 
      </ul>
    </nav>
  );
}

export default Nav;
