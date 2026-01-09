import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const predictedCrop = window.predictedCrop;  // fallback

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App crop={predictedCrop} />
  </React.StrictMode>
);
