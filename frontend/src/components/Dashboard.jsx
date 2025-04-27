import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Parking Slot Machine Learning</h1>
      
      <div className="flex flex-col space-y-6">
        <Link 
          to="/rush-hour-check" 
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Rush Hour Check
        </Link>
        
        <Link 
          to="/availability-check" 
          className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Availability Check
        </Link>

        <Link 
          to="/demand-check" 
          className="bg-yellow-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
        >
          System Demand Check
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
