import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function RegisterPage() {
  const webcamRef = useRef(null);
  const [username, setUsername] = useState('');

  const captureAndRegister = async () => {
    if (!username.trim()) return alert('Username is required.');
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert('Unable to capture image. Please try again.');

    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      alert(data.message || data.error || 'Registration failed.');
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-purple-800">Register Your Face</h2>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="rounded-lg overflow-hidden border border-gray-300 shadow-md">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto object-cover"
          />
        </div>

        <button
          onClick={captureAndRegister}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition duration-200 shadow-md"
        >
          Register
        </button>
      </div>
    </div>
  );
}
