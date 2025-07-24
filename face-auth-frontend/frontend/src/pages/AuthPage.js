// src/pages/AuthPage.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-4">
          User Authentication
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Please choose an option below to log in or register
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
