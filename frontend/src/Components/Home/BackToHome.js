import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Home icon for added style

const BackToHome = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <button
      onClick={handleGoHome}
      className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-transform duration-300 font-bold shadow-lg hover:scale-105"
    >
      <FaHome className="mr-2" /> {/* Icon before the text */}
      Back to Home
    </button>
  );
};

export default BackToHome;
