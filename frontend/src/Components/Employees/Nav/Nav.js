import React from 'react';
import { Link } from "react-router-dom";
import BackToHome from '../../Home/BackToHome';

function Nav() {
  return (
    <nav className="bg-green-500 bg-opacity-0 backdrop-blur-md rounded-lg shadow-lg p-6 flex items-center fixed top-0 w-full z-50">
      
      {/* Left-aligned Back to Home button */}
      <div className="flex-shrink-0">
        <BackToHome />
      </div>

      {/* Spacer to push nav items to the center */}
      <div className="flex-grow"></div>

      {/* Centered navigation links */}
      <ul className="flex space-x-10 items-center">


        <li>
          <Link to="/addemployee" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD EMPLOYEE
          </Link>
        </li>

        <li>
          <Link to="/employeedetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ALL EMPLOYEES
          </Link>
        </li>

        <li>
          <Link to="/addbonus" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD BONUS
          </Link>
        </li>

      </ul>

      {/* Spacer to balance the layout */}
      <div className="flex-grow"></div>
    </nav>
  );
}

export default Nav;