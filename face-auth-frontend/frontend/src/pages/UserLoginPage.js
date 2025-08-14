'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';
import Button from '../components/Button/Button.jsx'; // Assuming you have a Button component

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

  /* Keyframes for the cosmic gradient background animation */
  @keyframes cosmicGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Apply the cosmic gradient background with animation */
  .cosmic-gradient-bg {
    background: linear-gradient(-45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent1}, ${colors.accent2});
    background-size: 400% 400%; /* Make the gradient larger than the viewport for movement */
    animation: cosmicGradient 15s ease infinite; /* Smooth, infinite animation */
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
`;

export default function UserLoginPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const controls = useAnimation(); // Framer Motion controls

  useEffect(() => {
    // Start initial animation for the card
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  const handleLogin = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return toast.error('Failed to capture image.');

    setLoading(true);
    const loginToast = toast.loading('Verifying your face...');

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('image', file);

      // Adjust the API endpoint as needed
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Login successful!', { id: loginToast });
        navigate('/dashboard', { replace: true }); // Prevent back to login
      } else {
        toast.error(data.error || 'Login failed.', { id: loginToast });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred.', { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      {/* Main container with cosmic gradient background */}
      <div className="min-h-screen flex items-center justify-center cosmic-gradient-bg px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-8 -mt-6 sm:p-10 shadow-xl border border-white/30 w-full max-w-md text-center tilt-card relative overflow-hidden"
          style={{
            boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
          }}
        >
          {/* Decorative glowing elements (optional, can be added as per UserAuthPage) */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-accent1 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent2 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-4s' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-6s' }}></div>

          {/* Icon/Illustration Area */}
          <div className="mb-6 relative z-10">
            <img
              src="/images/face-auth.png" // Replace with your login specific icon/illustration
              alt="Login Icon"
              className="h-16 w-16 mx-auto mb-2 opacity-80"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 glitch-on-hover relative z-10">
            <span className="glitch-text">Face Login</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 mb-6 relative z-10">
            Please align your face with the camera to log in securely.
          </p>

          <div className="rounded-lg overflow-hidden border border-white/30 shadow-lg mb-6 relative z-10">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-auto object-cover rounded-lg"
              videoConstraints={{
                facingMode: 'user',
              }}
              mirrored={false}
            />

          </div>

          <div className="relative z-10">
            <Button
              onClick={handleLogin}
              text={loading ? 'Logging in...' : 'Login with Face'}
              isLoading={loading}
              className="w-full" // Ensure the button takes full width
            />
          </div>

          <p className="mt-6 text-sm text-gray-300 relative z-10">
            New here?{' '}
            <Link to="/register" className="text-accent2 hover:underline font-semibold">
              Register now
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}