import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RushHourCheck from './components/RushHourCheck';
import AvailabilityCheck from './components/AvailabilityCheck';
import DemandCheck from './components/DemandCheck';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rush-hour-check" element={<RushHourCheck />} />
        <Route path="/availability-check" element={<AvailabilityCheck />} />
        <Route path="/demand-check" element={<DemandCheck />} />
      </Routes>
    </Router>
  );
};

export default App;
