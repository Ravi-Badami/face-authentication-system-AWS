'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';
import Button from '../components/Button/Button.jsx';

const colors = {
  primary: '#4A247D',
  secondary: '#6B4FA2',
  accent1: '#8B5CF6',
  accent2: '#6EE7B7',
  background: '#F3F4F6',
  surface: 'rgba(255, 255, 255, 0.3)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textDark: '#374151',
  cardBorder: 'rgba(255, 255, 255, 0.4)',
  mainContainerBorder: 'rgba(255, 255, 255, 0.5)',
};

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  body {
    font-family: 'Inter', sans-serif;
  }

  @keyframes cosmicGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .cosmic-gradient-bg {
    background: linear-gradient(-45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent1}, ${colors.accent2});
    background-size: 400% 400%;
    animation: cosmicGradient 15s ease infinite;
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .glitch-on-hover:hover .glitch-text {
    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
  }

  .tilt-card {
    transform-style: preserve-3d;
    transition: transform 0.3s ease-out;
  }

  .tilt-card:hover {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
  }

  .tilt-card:active {
    transform: perspective(1000px) rotateX(2deg) rotateY(2deg) scale(0.98);
  }

  @keyframes animate-blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
`;

export default function UserRegisterPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  const captureAndRegister = async () => {
    if (!username.trim()) {
      return toast.error('Username is required.');
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      return toast.error('Unable to capture image. Please try again.');
    }

    setLoading(true);
    const registerToast = toast.loading('Registering your face...');

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Registration successful!', { id: registerToast });
        navigate('/login', { replace: true });
      } else {
        toast.error(data.error || 'Registration failed.', { id: registerToast });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred during registration.', { id: registerToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen flex items-center justify-center cosmic-gradient-bg px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/30 w-full max-w-md min-h-[85vh] sm:min-h-[75vh] flex flex-col justify-between text-center tilt-card relative overflow-hidden"
          style={{
            boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-accent1 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent2 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-4s' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-6s' }}></div>

          <div className="mb-4 relative z-10">
            <img
              src="/images/face-auth.png"
              alt="Register Icon"
              className="h-16 w-16 mx-auto mb-2 opacity-80"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 glitch-on-hover relative z-10">
            <span className="glitch-text">Face Registration</span>
          </h2>
          <p className="text-sm text-gray-200 mb-4 relative z-10">
            Enter your username and align your face to register.
          </p>

          <div className="mb-4 relative z-10">
            <input
              type="text"
              placeholder="Enter username"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent1 shadow-inner transition duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="rounded-lg overflow-hidden border border-white/30 shadow-lg mb-4 relative z-10 h-64 sm:h-72">

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover rounded-lg"
              videoConstraints={{
                facingMode: 'user',
              }}
              mirrored={false}
            />
          </div>

          <div className="relative z-10">
            <Button
              onClick={captureAndRegister}
              text={loading ? 'Registering...' : 'Register Face'}
              isLoading={loading}
              className="w-full"
            />
          </div>

          <p className="mt-4 text-sm text-gray-300 relative z-10">
            Already have an account?{' '}
            <Link to="/login" className="text-accent2 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
