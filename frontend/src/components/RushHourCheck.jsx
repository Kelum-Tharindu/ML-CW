import React, { useState } from 'react';

const RushHourCheck = () => {
  const [formData, setFormData] = useState({
    Timestamp: '',
    Parking_Lot_ID: '',
    Weather: '',
    Avg_Entry_15Min: '',
    Avg_Exit_15Min: '',
    Avg_Waiting_Time: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/predict2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const resultData = await response.json();
    setResult(resultData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Rush Hour Check</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg space-y-4">
        <input
          type="text"
          name="Timestamp"
          placeholder="Timestamp"
          value={formData.Timestamp}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Parking_Lot_ID"
          placeholder="Parking Lot ID"
          value={formData.Parking_Lot_ID}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Weather"
          placeholder="Weather"
          value={formData.Weather}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Avg_Entry_15Min"
          placeholder="Avg Entry 15 Min"
          value={formData.Avg_Entry_15Min}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Avg_Exit_15Min"
          placeholder="Avg Exit 15 Min"
          value={formData.Avg_Exit_15Min}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Avg_Waiting_Time"
          placeholder="Avg Waiting Time"
          value={formData.Avg_Waiting_Time}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          Check Rush Hour
        </button>
      </form>

      {result && (
        <div className="mt-6">
          {result.Rush_Hour_Prediction === 1 && (
            <p className="text-xl font-semibold text-green-500">Rush Hour</p>
          )}
          {result.Rush_Hour_Prediction === 0 && (
            <p className="text-xl font-semibold text-red-500">No Rush</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RushHourCheck;
