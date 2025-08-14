'use client';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Button from '../components/Button/Button.jsx';

// Define color palette for consistent styling
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  body {
    font-family: 'Inter', sans-serif;
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

  .glitch-on-click {
    animation: glitch 0.2s cubic-bezier(.25, .46, .45, .94) both 2;
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
`;

export default function HomePage() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const cardRefs = useRef([]);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (vantaRef.current && !vantaEffect.current) {
      const scriptThree = document.createElement('script');
      scriptThree.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      scriptThree.onload = () => {
        const scriptVanta = document.createElement('script');
        scriptVanta.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
        scriptVanta.onload = () => {
          if (vantaRef.current) {
            vantaEffect.current = window.VANTA.GLOBE({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              // These are the new Vanta.js configuration options from your request
              color: 0x0,
              color2: 0x0,
              size: 1.10,
              backgroundColor: 0x31bdca
            });
          }
        };
        document.body.appendChild(scriptVanta);
      };
      document.body.appendChild(scriptThree);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const mainContainer = document.querySelector('.main-content-container');
    if (mainContainer) {
      observer.observe(mainContainer);
    }

    return () => {
      if (mainContainer) {
        observer.unobserve(mainContainer);
      }
    };
  }, [controls]);

  const handleRoleClick = (role) => {
    const buttonElement = document.getElementById(`${role}-button`);
    if (buttonElement) {
      buttonElement.classList.add('glitch-on-click');
      setTimeout(() => {
        buttonElement.classList.remove('glitch-on-click');
        navigate(role === 'user' ? '/auth' : '/admin');
      }, 300);
    } else {
      navigate(role === 'user' ? '/auth' : '/admin');
    }
  };

  return (
    <>
      <style>{customStyles}</style>

      <div ref={vantaRef} className="fixed inset-0 z-0"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Wrapper div to apply the horizontal offset */}
        <div style={{ transform: 'translateX(-17%)' }} className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className="main-content-container w-full max-w-4xl bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-12 sm:p-16 shadow-2xl border-2 border-white/40 relative overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 10px 20px -5px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Your existing content */}
            <div className="absolute -top-12 -left-12 w-56 h-56 bg-accent1 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-accent2 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse delay-500"></div>

            <div className="text-center mb-10">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 leading-tight glitch-on-hover">
                <span className="glitch-text">Face Auth Project</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
                Welcome to the Face Authentication Project. Please select your role to proceed and experience secure access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Card */}
              <motion.div
                ref={(el) => (cardRefs.current[0] = el)}
                className="tilt-card bg-white/25 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/30"
                style={{
                  boxShadow: '0 10px 20px -6px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.2)',
                }}
                onClick={() => handleRoleClick('user')}
              >
                <h2 className="text-2xl font-bold text-accent1 mb-2 glitch-on-hover">
                  <span className="glitch-text">User Access</span>
                </h2>
                <p className="text-black font-semibold text-base mb-4">
                  Securely log in and manage your profile using facial recognition.
                </p>
                <Button text="User" className="px-5 py-2 rounded-full text-base font-semibold"></Button>
              </motion.div>

              {/* Admin Card */}
              <motion.div
                ref={(el) => (cardRefs.current[1] = el)}
                className="tilt-card bg-white/25 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/30"
                style={{
                  boxShadow: '0 10px 20px -6px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.2)',
                }}
                onClick={() => handleRoleClick('admin')}
              >
                <h2 className="text-2xl font-bold text-accent2 mb-2 glitch-on-hover">
                  <span className="glitch-text">Admin Dashboard</span>
                </h2>
                <p className="text-black font-semibold text-base mb-4">
                  Manage users and system settings with elevated privileges.
                </p>
                <Button text="Admin" className="px-5 py-2 rounded-full text-base font-semibold"></Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}