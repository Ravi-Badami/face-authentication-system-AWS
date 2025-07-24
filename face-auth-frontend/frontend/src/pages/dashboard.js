import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true }); // ✅ Prevents going back to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-green-700">Welcome!</h1>
        <p className="text-lg text-gray-600">You have successfully logged in.</p>
        <button
          onClick={handleGoHome}
          className="mt-4 px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
}
