// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use `react-dom/client` for React 18+
import App from './app/App'; // Ensure the path is correct
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09]
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
