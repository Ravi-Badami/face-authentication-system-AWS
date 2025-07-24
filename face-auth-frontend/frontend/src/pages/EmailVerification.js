import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState('email'); // email → otp
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // <-- react-router navigation

  // STEP 1: Send OTP to email
  const sendOTP = async () => {
    if (!email.trim()) return alert('Please enter your email.');

    try {
      const res = await axios.post('http://localhost:5001/send-otp', { email });
      setMessage(res.data.message);
      setStep('otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  // STEP 2: Verify OTP and navigate to /admin/register
  const verifyOTP = async () => {
    if (!otp.trim()) return alert('Please enter the OTP.');

    try {
      const res = await axios.post('http://localhost:5001/verify-otp', { email, otp });
      setMessage(res.data.message);

      // ✅ Redirect to /admin/register on success
      if (res.status === 200) {
        setTimeout(() => {
          navigate('/admin/register');
        }, 1000); // Small delay to let user read the message
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-green-800">Admin Email Verification</h2>

        {step === 'email' && (
          <>
            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOTP}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
            <button
              onClick={verifyOTP}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="text-sm text-gray-600 mt-2">{message}</p>
      </div>
    </div>
  );
}
