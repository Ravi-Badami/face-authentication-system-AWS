import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Add Toaster here */}
  </React.StrictMode>
);
