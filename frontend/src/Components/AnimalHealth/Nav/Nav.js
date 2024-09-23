import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';

function Nav() {
  return (
    <nav className='navbar'>
      <ul className='nav-list'>
        {/*<li className='nav-item'>
            <Link to="/animalhome" className="nav-link">
            <h1>Animal Home</h1>
            </Link>
        </li>*/}

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
