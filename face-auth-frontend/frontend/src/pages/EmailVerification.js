'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';
import cloudVideo from '../assets/Cloud_Computing.mp4';
import Button from '../components/Button/Button';

// Define color palette for consistent styling
const colors = {
  primary: '#4A247D', // Dark purple
  secondary: '#6B4FA2', // Medium purple
  accent1: '#8B5CF6', // Bright purple/blue
  accent2: '#6EE7B7', // Teal/mint green
  background: '#F3F4F6', // Light gray (not directly used in gradient, but good to have)
  surface: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white for card
  textPrimary: '#FFFFFF', // White text
  textSecondary: '#D1D5DB', // Light gray text
  textDark: '#374151', // Dark gray text
  cardBorder: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white border
  mainContainerBorder: 'rgba(255, 255, 255, 0.5)', // Slightly more opaque border
};

// Custom CSS styles for animations and global typography
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  body {
    font-family: 'Inter', sans-serif; /* Apply Inter font globally */
  }

  /* Keyframes for the glitch effect on text */
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  /* Apply glitch animation on hover to elements with glitch-text */
  .glitch-on-hover:hover .glitch-text {
    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
  }

  /* 3D tilt effect for cards */
  .tilt-card {
    transform-style: preserve-3d; /* Enable 3D transformations for children */
    transition: transform 0.3s ease-out; /* Smooth transition for tilt */
  }

  .tilt-card:hover {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg); /* Tilt on hover */
  }

  .tilt-card:active {
    transform: perspective(1000px) rotateX(2deg) rotateY(2deg) scale(0.98); /* Slight press effect on click */
  }

  /* Keyframes for blob animations */
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -30px) scale(1.1); }
    50% { transform: translate(-20px, 40px) scale(0.9); }
    75% { transform: translate(30px, -20px) scale(1.2); }
  }
`;

export default function AdminEmailVerification() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState('email'); // email → otp
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const controls = useAnimation(); // Framer Motion controls

  useEffect(() => {
    // Start initial animation for the card
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  // STEP 1: Send OTP to email
  const sendOTP = async () => {
    if (!email.trim()) return toast.error('Please enter your email.');

    setLoading(true);
    const otpToast = toast.loading('Sending OTP...');

    try {
      const res = await fetch('http://localhost:5001/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: otpToast });
        setStep('otp');
      } else {
        toast.error(data.message || 'Failed to send OTP.', { id: otpToast });
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      toast.error('An unexpected error occurred.', { id: otpToast });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and navigate to /admin/register
  const verifyOTP = async () => {
    if (!otp.trim()) return toast.error('Please enter the OTP.');

    setLoading(true);
    const verifyToast = toast.loading('Verifying OTP...');

    try {
      const res = await fetch('http://localhost:5001/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'OTP verified successfully!', { id: verifyToast });
        // Redirect to /admin/register on success
        setTimeout(() => {
          navigate('/admin/register');
        }, 1000);
      } else {
        toast.error(data.message || 'OTP verification failed.', { id: verifyToast });
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      toast.error('An unexpected error occurred.', { id: verifyToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      {/* Main container with white background. */}
      <div className="bg-white min-h-screen flex flex-col lg:flex-row items-center justify-center lg:items-stretch px-4 py-8 sm:px-6 sm:py-12">
        {/* Left side: The Admin Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 shadow-xl border border-white/30 w-full max-w-md text-center tilt-card relative overflow-hidden"
            style={{
              boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
            }}
          >
            {/* Decorative glowing elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-accent1 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent2 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-4s' }}></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-6s' }}></div>

            {/* Icon/Illustration Area */}
            <div className="mb-6 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-black opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-3 glitch-on-hover relative z-10">
              <span className="glitch-text">Admin Email Verification</span>
            </h2>
            <p className="text-sm sm:text-base text-black mb-6 relative z-10">
              Please enter your email to receive a verification code.
            </p>

            <div className="relative z-10 space-y-4">
              {step === 'email' && (
                <>
                  <input
                    type="email"
                    placeholder="Enter admin email"
                    className="w-full px-4 py-2 rounded-xl text-textDark bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={sendOTP}
                    text={loading ? 'Sending...' : 'Send OTP'}
                    isLoading={loading}
                    className="w-full"
                  />
                </>
              )}

              {step === 'otp' && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 rounded-xl text-textDark bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent1"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <Button
                    onClick={verifyOTP}
                    text={loading ? 'Verifying...' : 'Verify OTP'}
                    isLoading={loading}
                    className="w-full"
                  />
                </>
              )}
            </div>
            <p className="mt-6 text-sm text-black relative z-10">
              Already verified?{' '}
              <Link to="/admin" className="text-accent2 hover:underline text-blue-400 font-semibold">
                Go to Login
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right side: Looping Video */}
        <div className="w-full lg:w-1/3  items-center justify-center p-4 lg:p-8">
          <div className="relative w-full h-[110%]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute top-0 left-0 w-full h-full "
              src={cloudVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

      </div>
    </>
  );
}
