// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Face Auth Project
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Choose your role to continue
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            User
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
