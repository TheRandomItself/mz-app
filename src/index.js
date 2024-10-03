import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09]
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
