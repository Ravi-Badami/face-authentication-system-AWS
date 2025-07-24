import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminAuth() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold text-green-800 mb-4">
          Admin Authentication
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Please choose an option below to log in or register as an admin
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/admin/login"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            Login
          </Link>
          <Link
            to="/admin/verifyEmail"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
