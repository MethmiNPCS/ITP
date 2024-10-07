
import React from 'react';
import { Link } from "react-router-dom";
//import BackToHome from '../../Home/BackToHome';

function Nav() {
  return (
    <nav className="bg-green-500 bg-opacity-0 backdrop-blur-md rounded-lg shadow-lg p-6 flex items-center fixed top-0 w-full z-50">
      
      {/* Left-aligned Back to Home button */}
      <div className="flex-shrink-0">
        
      </div>

      {/* Spacer to push nav items to the center */}
      <div className="flex-grow"></div>

      {/* Centered navigation links */}
      <ul className="flex space-x-10 items-center">
        <li>
          <Link to="/producthome" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            DASHBOARD
          </Link>
        </li>

        <li>
          <Link to="/imageuploder" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            IMAGE
          </Link>
        </li>

        <li>
          <Link to="/addproduct" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD PRODUCT
          </Link>
        </li>

        <li>
          <Link to="/productdetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            PRODUCT DETAILS
          </Link>
        </li>

        <li>
          <Link to="/chartpage" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            Chart
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

*/





 
//<li className="nav-item">
//<Link to="/producthome" className="nav-link">
//PRODUCT HOME
//</Link>
//</li>
