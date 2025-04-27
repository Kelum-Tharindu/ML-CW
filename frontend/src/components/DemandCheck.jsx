import React, { useState } from 'react';

const DemandCheck = () => {
  const [formData, setFormData] = useState({
    timestamp: '',
    total_used_slots: '',
    total_booking_count: '',
    weather: ''
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
    const response = await fetch('http://localhost:5000/predict3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const resultData = await response.json();
    setResult(resultData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">System Demand Check</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg space-y-4">
        <input
          type="text"
          name="timestamp"
          placeholder="Timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="total_used_slots"
          placeholder="Total Used Slots"
          value={formData.total_used_slots}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="total_booking_count"
          placeholder="Total Booking Count"
          value={formData.total_booking_count}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="weather"
          placeholder="Weather"
          value={formData.weather}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          Check System Demand
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          {result.prediction === 2 && <p className="text-xl font-semibold text-red-500">High Demand</p>}
          {result.prediction === 1 && <p className="text-xl font-semibold text-yellow-500">Middle Demand</p>}
          {result.prediction === 0 && <p className="text-xl font-semibold text-green-500">Low Demand</p>}
        </div>
      )}
    </div>
  );
};

export default DemandCheck;
