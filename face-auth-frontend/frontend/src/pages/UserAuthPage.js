'use client';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Button from '../components/Button/Button.jsx';
// Removed: import * as THREE from 'three'; // Three.js import is removed as per request

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

export default function UserAuthPage() {
  // Animation controls for Framer Motion elements
  const controls = useAnimation();

  // Effect for Framer Motion animation (runs once on component mount)
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }, // Smooth fade-in and slide-up
    });
  }, [controls]); // Dependency on controls ensures it only runs when controls object is stable

  return (
    <>
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      {/* Main container with cosmic gradient background, divided into two columns on large screens */}
      {/* Increased overall padding to give more space around the two halves */}
      <div className="flex flex-col h-screen w-screen lg:flex-row items-center justify-center min-h-screen cosmic-gradient-bg px-4 py-8 sm:px-6 sm:py-12">
        {/* Left Half - Authentication Form */}
        {/* Added h-full to make this div stretch vertically within its parent */}
        <div className="w-full lg:w-1/2 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className="bg-white/20 backdrop-blur-xl rounded-[2rem] h-[65%] p-8 sm:p-10 shadow-xl border border-white/30 w-full max-w-md text-center tilt-card relative overflow-hidden"
            style={{
              boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
            }}
          >
            {/* ... (existing absolute positioned glowing elements) ... */}

            {/* --- ADD THIS ICON/ILLUSTRATION AREA --- */}
            <div className="mb-6 relative z-10"> {/* Add margin-bottom */}
              {/* You can use an SVG, an <img> tag, or an icon library component here */}
              <img
                src="/images/user-auth.png" /* Replace with your SVG/PNG icon */
                alt="Authentication Icon"
                className="h-16 w-16 mx-auto mb-2 opacity-80" /* Adjust size and opacity */
              />
              {/* Or use an icon from a library like Heroicons, FontAwesome etc. */}
              {/* <LockClosedIcon className="h-16 w-16 mx-auto text-white opacity-80" /> */}
            </div>
            {/* --- END ICON AREA --- */}

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 glitch-on-hover relative z-10">
              <span className="glitch-text">User Authentication</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-200 mb-6 relative z-10">
              Choose an option to securely log in or create your profile.
            </p>

            <div className="flex justify-center gap-4 flex-wrap relative z-10">
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-base font-semibold"
              >
                <Button text="Login"></Button>
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-base font-semibold"
              >
                <Button text="Register"></Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Half - 3D Object Display via iframe */}
        {/* On small screens, it takes full width and has a minimum height. On large screens, it takes half width and full screen height. */}
        {/* Added h-full to make this div stretch vertically within its parent. Removed redundant min-h classes. */}
        <div className="w-full lg:w-1/2 flex items-center justify-center h-full">
          <iframe
            src="animations/UserAuth/index.html" // <--- IMPORTANT: Replace this with the path to your HTML file
            title="3D Object Display"
            className="w-full h-[82%] rounded-[2.5rem] mt-44 "
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Adjust sandbox permissions as needed
            style={{
              background: 'transparent', // Allow the parent's cosmic gradient to show through if iframe content is transparent
            }}
          ></iframe>
        </div>
      </div>
    </>
  );
}
