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
PRODUCT HOME
</Link>
</li>
       
         
        <li className="nav-item">
          <Link to="/imageuploder" className="nav-link">
        IMAGE UPLODER
          </Link>
        </li>
               
               
        <li className="nav-item">
          <Link to="/addproduct" className="nav-link">
          ADD PRODUCT
          </Link>
        </li>
                
        <li className="nav-item">
          <Link to="/productdetails" className="nav-link">
           PRODUCT DETAILS
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/chartpage" className="nav-link">
        CHART
          </Link>
        </li>


       
 
      </ul>
    </nav>
  );
}

export default Nav;







 
//<li className="nav-item">
//<Link to="/producthome" className="nav-link">
//PRODUCT HOME
//</Link>
//</li>
