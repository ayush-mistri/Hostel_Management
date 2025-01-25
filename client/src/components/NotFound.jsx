// src/components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary text-white text-center p-4">
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <h2 className="text-5xl mt-4">Page Not Found</h2>
      <p className="text-lg mt-2">Oops! The page you are looking for does not exist.</p>
      <button 
        onClick={handleGoBack} 
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
      >
        Go Back
      </button>
      {/* <div className="mt-10">
        
        <img 
          src="https://via.placeholder.com/300" 
          alt="404 illustration" 
          className="w-64 h-64 object-cover"
        />
      </div> */}
    </div>
  );
};

export default NotFound;
