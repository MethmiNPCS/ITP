import React from 'react';
import Nav from './Nav/Nav';
import img from '../img/farm.jpg';

function ProductHome() {
  const backgroundImageStyle = {
    backgroundImage: 'url(/images/farm.jpg)', // Path inside 'public' folder
    backgroundSize: 'cover', // Ensures the image covers the entire div
    backgroundPosition: 'center', // Center the background image
    backgroundRepeat: 'no-repeat', // Prevent repeating the background image
    minHeight: '60vh', // Full height of the viewport
    width: '120%', // Full width of the viewport
  };

  return (
    <div style={backgroundImageStyle}>
      <center>
        <Nav />
       
        <div>
          {/* Display product image */}
          <img src={img} alt="Product" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </center>
    </div>
  );
}

export default ProductHome;
