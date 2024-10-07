import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';

function Nav() {
  return (
    <nav className='navbar'>
      <ul className='nav-list'>
      <li className='nav-item'>
            <Link to="/home" className="nav-link">
            <h1>Home</h1>
            </Link>
        </li>


        <li className='nav-item'>
            <Link to="/animalhome" className="nav-link">
            <h1>Animal Home</h1>
            </Link>
        </li>

        <li className='nav-item'>
            <Link to="/addanimal" className="nav-link">
            <h1>Add Animal</h1>
            </Link>
        </li>

        <li className='nav-item'>
            <Link to="/animaldetails" className="nav-link">
            <h1>Animal Details</h1>
            </Link>
        </li>

        <li className='nav-item'>
            <Link to="/addtreatment" className="nav-link">
            <h1>Add Treatment</h1>
            </Link>
        </li>

        <li className='nav-item'>
            <Link to="/treatmentdetails" className="nav-link">
            <h1>Treatment Details</h1>
            </Link>
        </li>

        </ul>
    </nav>
  );
}

export default Nav


/*
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
          <Link to="/animalhome" className="text-green-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-white hover:bg-opacity-20">
            ANIMALDASHBOARD
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
    </nav>
  );
}

export default Nav;
*/