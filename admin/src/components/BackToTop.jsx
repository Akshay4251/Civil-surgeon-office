import React, { useState, useEffect } from "react";
import { FaArrowUp, FaChevronUp } from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", calculateScrollProgress);
    return () => window.removeEventListener("scroll", calculateScrollProgress);
  }, []);

  return (
    <>
      {/* Main Back to Top Button */}
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 left-6 z-50
          transform transition-all duration-500 ease-in-out
          ${visible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-20 opacity-0 scale-0'
          }
        `}
        aria-label="Back to top"
      >
        {/* Circular Progress Ring */}
        <div className="relative">
          {/* Outer ring with progress */}
          <svg 
            className="absolute inset-0 -rotate-90 w-14 h-14"
            viewBox="0 0 56 56"
          >
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="rgb(252, 231, 243)"
              strokeWidth="4"
              fill="none"
              className="opacity-50"
            />
            {/* Progress circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Button Content */}
          <div 
            className={`
              relative w-14 h-14 rounded-full 
              bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600
              shadow-lg hover:shadow-xl
              flex items-center justify-center
              transform transition-all duration-300
              ${isHovered ? 'scale-110' : 'scale-100'}
              group
            `}
          >
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20"></div>
            
            {/* Inner white circle */}
            <div className="absolute inset-1 rounded-full bg-white opacity-10"></div>
            
            {/* Icon container */}
            <div className="relative flex flex-col items-center justify-center">
              {/* Animated arrow */}
              <FaChevronUp 
                className={`
                  text-white text-lg
                  transform transition-all duration-300
                  ${isHovered ? '-translate-y-1' : 'translate-y-0'}
                `}
              />
              {/* Second arrow for animation effect */}
              <FaChevronUp 
                className={`
                  text-white text-lg -mt-3
                  transform transition-all duration-300
                  ${isHovered ? '-translate-y-1 opacity-100' : 'translate-y-0 opacity-50'}
                `}
              />
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <div 
          className={`
            absolute left-16 bottom-2 
            bg-gradient-to-r from-pink-600 to-purple-600
            text-white text-xs font-semibold
            px-3 py-1.5 rounded-full
            shadow-lg whitespace-nowrap
            transform transition-all duration-300
            ${isHovered 
              ? 'translate-x-0 opacity-100 scale-100' 
              : '-translate-x-2 opacity-0 scale-95'
            }
          `}
        >
          Back to Top
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-600 rotate-45"></div>
        </div>
      </button>

      {/* Alternative Floating Design (Optional) */}
      {/* Uncomment below for a different style */}
      {/* 
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 left-6 z-50
          transform transition-all duration-500 ease-in-out
          ${visible 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-20 opacity-0'
          }
        `}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-pink-100 hover:border-pink-300 transition-all">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaArrowUp className="text-white text-sm" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent pr-2">
                TOP
              </span>
            </div>
          </div>
        </div>
      </button>
      */}

      {/* Minimal Pill Design (Optional Alternative) */}
      {/* Uncomment below for a minimal style */}
      {/*
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 left-6 z-50
          transform transition-all duration-500 ease-in-out
          ${visible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-20 opacity-0'
          }
        `}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MdKeyboardArrowUp 
                className={`text-xl transform transition-transform duration-300 ${
                  isHovered ? '-translate-y-0.5' : ''
                }`} 
              />
            </div>
            <span className={`font-medium text-sm transition-all duration-300 ${
              isHovered ? 'w-20' : 'w-0 overflow-hidden'
            }`}>
              Back to Top
            </span>
          </div>
          
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full blur-sm"></div>
        </div>
      </button>
      */}
    </>
  );
};

export default BackToTop;