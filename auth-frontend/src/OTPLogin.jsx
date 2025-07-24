// src/OTPLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OTPLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [message, setMessage] = useState('');

 const backendURL = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`;

console.log('PORT:', import.meta.env.VITE_BACKEND_PORT);

  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
 const res = await axios.post(`${backendURL}/send-otp`, { email });
      setMessage(res.data.message);
      setStep('otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const verifyOTP = async () => {
    try {
    const res = await axios.post(`${backendURL}/verify-otp`, { email, otp });
      setMessage(res.data.message);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Email OTP Login</h2>
      {step === 'email' ? (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
      <p>{message}</p>
    </div>
  );
}

export default OTPLogin;
