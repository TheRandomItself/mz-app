import React from 'react';
import Map from './Map'; // Adjust the path if needed
import 'leaflet/dist/leaflet.css';
const App = () => {
  return (
    <div>
      <h1>City Map with Borders and Points</h1>
      <Map />
    </div>
  );
};
export default App; 