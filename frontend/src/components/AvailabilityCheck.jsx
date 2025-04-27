import React, { useState } from 'react';

const AvailabilityCheck = () => {
  const [formData, setFormData] = useState({
    Timestamp: '',
    Parking_Lot_ID: '',
    Event: '',
    Holiday: '',
    Weather: ''
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
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const resultData = await response.json();
    setResult(resultData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Availability Check</h2>
      
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
          name="Event"
          placeholder="Event"
          value={formData.Event}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="Holiday"
          placeholder="Holiday"
          value={formData.Holiday}
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
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          Check Availability
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-xl font-semibold text-green-500">
            Available Car Spots: {result.Available_Car_Spots}
          </p>
          <p className="text-xl font-semibold text-yellow-500">
            Available Motorcycle Spots: {result.Available_Motorcycle_Spots}
          </p>
          <p className="text-xl font-semibold text-blue-500">
            Available Truck Spots: {result.Available_Truck_Spots}
          </p>
          <p className="text-xl font-semibold text-red-500">
            Available Van Spots: {result.Available_Van_Spots}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCheck;
