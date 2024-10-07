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
          <Link to="/animalhome" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            DASHBOARD
          </Link>
        </li>

        <li>
          <Link to="/addanimal" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD ANIMAL
          </Link>
        </li>

        <li>
          <Link to="/animaldetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ANIMAL DETAILS
          </Link>
        </li>

        <li>
          <Link to="/addtreatment" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD TREATMENT
          </Link>
        </li>

        <li>
          <Link to="/treatmentdetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            TREATMENT DETAILS
          </Link>
        </li>
      </ul>

      {/* Spacer to balance the layout */}
      <div className="flex-grow"></div>
    </nav>
  );
}

export default Nav;
