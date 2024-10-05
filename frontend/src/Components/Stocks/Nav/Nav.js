import React from 'react';
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="bg-green-500 bg-opacity-0 backdrop-blur-md rounded-lg shadow-lg p-6 flex justify-center">
      <ul className="flex space-x-10">
        
        <li>
          <Link to="/Home" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            HOME
          </Link>
        </li>

        <li>
          <Link to="/stockhome" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            DASHBOARD
          </Link>
        </li>
               
        <li>
          <Link to="/addfood" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD FOOD ITEM
          </Link>
        </li>

        <li>
          <Link to="/fooddetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            AVAILABLE FOODS
          </Link>
        </li>

        <li>
          <Link to="/addmedicine" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ADD MEDICINE
          </Link>
        </li>
                
        <li>
          <Link to="/medicinedetails" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            AVAILABLE MEDICINES
          </Link>
        </li>       
      </ul>     
    </nav>
  );
}

export default Nav;
