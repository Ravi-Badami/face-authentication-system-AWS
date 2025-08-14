'use client';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Button from '../components/Button/Button';

// This is the Button component, now included in the same file to resolve the import error.


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

// Custom CSS styles for animations and global typography, copied from UserAuthPage
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

  /* Apply a default background to the body */
  body {
    font-family: 'Inter', sans-serif;
    background: #00b4ff; /* A blue background to complement the clouds */
    color: #333;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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
    transform-style: preserve-3d;
    transition: transform 0.3s ease-out;
  }

  .tilt-card:hover {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
  }

  .tilt-card:active {
    transform: perspective(1000px) rotateX(2deg) rotateY(2deg) scale(0.98);
  }

  /* Cloud Animation Styles */
  #background-wrap {
    bottom: 0;
    left: 0;
    padding-top: 50px;
    position: fixed;
    right: 0;
    top: 0;
    z-index: -1; /* Pushes the clouds to the background */
    pointer-events: none; /* Make sure clouds don't block interaction with the form */
  }

  /* KEYFRAMES */
  @-webkit-keyframes animateCloud {
    0% { margin-left: -1000px; }
    100% { margin-left: 100%; }
  }
  @-moz-keyframes animateCloud {
    0% { margin-left: -1000px; }
    100% { margin-left: 100%; }
  }
  @keyframes animateCloud {
    0% { margin-left: -1000px; }
    100% { margin-left: 100%; }
  }

  /* ANIMATIONS */
  .x1 {
    -webkit-animation: animateCloud 35s linear infinite;
    -moz-animation: animateCloud 35s linear infinite;
    animation: animateCloud 35s linear infinite;
    -webkit-transform: scale(0.65);
    -moz-transform: scale(0.65);
    transform: scale(0.65);
  }
  .x2 {
    -webkit-animation: animateCloud 20s linear infinite;
    -moz-animation: animateCloud 20s linear infinite;
    animation: animateCloud 20s linear infinite;
    -webkit-transform: scale(0.3);
    -moz-transform: scale(0.3);
    transform: scale(0.3);
  }
  .x3 {
    -webkit-animation: animateCloud 30s linear infinite;
    -moz-animation: animateCloud 30s linear infinite;
    animation: animateCloud 30s linear infinite;
    -webkit-transform: scale(0.5);
    -moz-transform: scale(0.5);
    transform: scale(0.5);
  }
  .x4 {
    -webkit-animation: animateCloud 18s linear infinite;
    -moz-animation: animateCloud 18s linear infinite;
    animation: animateCloud 18s linear infinite;
    -webkit-transform: scale(0.4);
    -moz-transform: scale(0.4);
    transform: scale(0.4);
  }
  .x5 {
    -webkit-animation: animateCloud 25s linear infinite;
    -moz-animation: animateCloud 25s linear infinite;
    animation: animateCloud 25s linear infinite;
    -webkit-transform: scale(0.55);
    -moz-transform: scale(0.55);
    transform: scale(0.55);
  }

  /* OBJECTS */
  .cloud {
    background: #fff;
    background: -moz-linear-gradient(top,  #fff 5%, #f1f1f1 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(5%,#fff), color-stop(100%,#f1f1f1));
    background: -webkit-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
    background: -o-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
    background: -ms-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
    background: linear-gradient(top,  #fff 5%,#f1f1f1 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff', endColorstr='#f1f1f1',GradientType=0 );
    
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    
    -webkit-box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);

    height: 120px;
    position: relative;
    width: 350px;
  }
  .cloud:after, .cloud:before {
    background: #fff;
    content: '';
    position: absolute;
    z-indeX: -1;
  }
  .cloud:after {
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    height: 100px;
    left: 50px;
    top: -50px;
    width: 100px;
  }
  .cloud:before {
    -webkit-border-radius: 200px;
    -moz-border-radius: 200px;
    border-radius: 200px;
    width: 180px;
    height: 180px;
    right: 50px;
    top: -90px;
  }
`;

export default function AdminAuthPage() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  return (
    <>
      <style>{customStyles}</style>

      {/* Cloud animation background */}
      <div id="background-wrap">
        <div className="x1">
          <div className="cloud"></div>
        </div>
        <div className="x2">
          <div className="cloud"></div>
        </div>
        <div className="x3">
          <div className="cloud"></div>
        </div>
        <div className="x4">
          <div className="cloud"></div>
        </div>
        <div className="x5">
          <div className="cloud"></div>
        </div>
      </div>

      <div className="flex flex-col h-screen w-screen lg:flex-row items-center justify-center min-h-screen">
        {/* Main content container with a z-index to be on top */}
        <div className="w-full lg:w-1/2 flex items-center justify-center h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className="bg-white/20 backdrop-blur-xl rounded-[2rem] h-[65%] p-8 sm:p-10 shadow-xl border border-white/30 w-full max-w-md text-center tilt-card relative overflow-hidden"
            style={{
              boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5), 0 6px 12px -3px rgba(0,0,0,0.3)',
            }}
          >
            <div className="mb-6 relative z-10">
              <img
                src="/images/user-auth.png" // Using a new placeholder image for admin
                alt="Admin Authentication Icon"
                className="h-16 w-16 mx-auto mb-2 opacity-80"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-3 glitch-on-hover relative z-10">
              <span className="glitch-text">Admin Authentication</span>
            </h2>
            <p className="text-sm sm:text-base text-black mb-6 relative z-10">
              Choose an option to securely log in or create your admin profile.
            </p>

            <div className="flex justify-center gap-4 flex-wrap relative z-10">
              <Link
                to="/admin/login"
                className="px-5 py-2 rounded-full text-base font-semibold"
              >
                {/* Replaced the default button with the imported Button component */}
                <Button text="Login"></Button>
              </Link>
              <Link
                to="/admin/verifyEmail"
                className="px-5 py-2 rounded-full text-base font-semibold"
              >
                {/* Replaced the default button with the imported Button component */}
                <Button text="Register"></Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
