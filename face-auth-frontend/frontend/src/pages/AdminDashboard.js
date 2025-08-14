'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';

// This is the Button component, now included in the same file for a self-contained solution.
const Button = ({ text, className = '', onClick = () => { }, isPrimary = true, isLoading = false }) => {
  const baseClasses = `
    px-6 py-3 rounded-full font-bold text-lg
    transition-all duration-300 transform
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    shadow-lg
    flex items-center justify-center
  `;

  const primaryClasses = `
    bg-gradient-to-r from-accent1 to-accent2 text-white
    hover:from-accent2 hover:to-accent1
    focus:ring-accent1
  `;

  const secondaryClasses = `
    bg-white text-textDark
    border border-gray-300
    hover:bg-gray-100
    focus:ring-white
  `;

  const disabledClasses = `
    bg-gray-400 cursor-not-allowed
  `;

  return (
    <button
      className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses} ${isLoading ? disabledClasses : ''} ${className}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
          {text}
        </>
      ) : (
        text
      )}
    </button>
  );
};

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

  /* Keyframes for blob animations */
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -30px) scale(1.1); }
    50% { transform: translate(-20px, 40px) scale(0.9); }
    75% { transform: translate(30px, -20px) scale(1.2); }
  }
`;


export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    // Start initial animation for the card
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
    fetchLogs();
  }, [controls]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Using fetch instead of axios
      const res = await fetch('http://localhost:5000/api/logs');
      if (!res.ok) {
        throw new Error('Failed to fetch logs');
      }
      const logsData = await res.json();

      // Sort logs by timestamp, which is a number
      const sortedLogs = logsData.sort((a, b) => a.timestamp - b.timestamp);

      // Add an attempt count for each user
      const userAttempts = {};
      const processedLogs = sortedLogs.map((log) => {
        userAttempts[log.username] = (userAttempts[log.username] || 0) + 1;
        return { ...log, attempt: userAttempts[log.username] };
      });

      setLogs(processedLogs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      toast.error('Failed to fetch login logs.');
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
          className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 shadow-xl border border-white/30 w-full max-w-6xl text-center tilt-card relative overflow-hidden"
          style={{
            boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
          }}
        >
          {/* Decorative glowing elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-accent1 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent2 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-4s' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-6s' }}></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent1 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '-8s' }}></div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 glitch-on-hover relative z-10">
            <span className="glitch-text">Admin Dashboard</span>
          </h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg relative z-10">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-semibold text-white/90">
                User Login Logs
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-300">
                Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-6 text-center text-gray-300">
                No logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300">
                  <thead className="bg-white/10 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Username</th>
                      <th className="px-6 py-3 text-left font-medium">Timestamp</th>
                      <th className="px-6 py-3 text-left font-medium">IP Address</th>
                      <th className="px-6 py-3 text-left font-medium text-center">Attempt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logs.map((log, index) => (
                      <tr key={index} className="hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{log.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(log.timestamp * 1000).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{log.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{log.attempt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-6 border-t border-white/20 text-right">
              <Button onClick={fetchLogs} text="Refresh Logs" isPrimary={false} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
