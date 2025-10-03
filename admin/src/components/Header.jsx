import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import translations from "../Translation.json";
import AccessibilityTools from "./AccessibilityTools"; 

const Header = ({ language, setLanguage }) => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const t = translations[language] || translations['en'] || {};

  const languages = [
    { code: "en", label: "English" },
    { code: "mr", label: "मराठी" },
    { code: "hi", label: "हिंदी" },
  ];

  const handleSelect = (code) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  // Map search keywords to routes
  const routes = {
    home: '/',
    about: '/about',
    contact: '/contact',
    'administrative setup': '/administrative-setup',
    organisation: '/organizations',
    gallery: '/gallery',
    rti: '/rti',
    rts: '/rts',
    'birth & death': '/birth-death',
    'performance report': '/performance-report',
    services: '/services'
  };

  const [suggestions, setSuggestions] = useState([]);

  // Handle input change & suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);
    const filtered = Object.keys(routes).filter((key) =>
      key.toLowerCase().includes(query)
    );
    setSuggestions(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const route = routes[query];
    if (route) {
      navigate(route);
    } else {
      alert("Page not found: " + searchQuery);
    }
    setSearchQuery('');
    setSuggestions([]);
    setSearchOpen(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full shadow-md bg-white">
      {/* Top Bar */}
      <div className="bg-amber-200 border-b">
        <div className="container mx-auto px-2 sm:px-4 py-1">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            {/* Government Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start text-[10px] sm:text-xs font-semibold text-gray-800">
              <a
                href="https://www.maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline whitespace-nowrap"
              >
                महाराष्ट्र शासन
              </a>
              <span className="text-gray-400 mx-1 sm:mx-2">|</span>
              <a
                href="https://www.maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline uppercase whitespace-nowrap"
              >
                GOVERNMENT OF MAHARASHTRA
              </a>
            </div>

            {/* Right side: Search + Language + Accessibility */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!isSearchOpen)}
                  className="p-1 sm:p-2 rounded hover:bg-black/10 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-md p-2 z-50 w-48 sm:w-56 md:w-64">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border px-2 py-1 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Type to search..."
                        autoFocus
                      />
                      {suggestions.length > 0 && (
                        <div className="border mt-1 rounded bg-white max-h-32 sm:max-h-40 overflow-y-auto shadow">
                          {suggestions.map((item, index) => (
                            <div
                              key={index}
                              className="px-2 py-1 hover:bg-pink-100 cursor-pointer text-xs sm:text-sm"
                              onClick={() => {
                                navigate(routes[item]);
                                setSearchQuery('');
                                setSuggestions([]);
                                setSearchOpen(false);
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="mt-2 px-2 sm:px-3 py-1 bg-pink-500 text-white text-xs sm:text-sm rounded hover:bg-pink-600"
                      >
                        Go
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1 px-1 sm:px-2 py-1 rounded hover:bg-black/10 transition-colors text-[10px] sm:text-xs"
                >
                  <span className="hidden sm:inline">🌐</span>
                  <span className="text-[10px] sm:text-xs">Language</span>
                  <FaChevronDown className={`h-2 w-2 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-24 sm:w-28 bg-white border rounded-md shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full text-left px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm ${
                          language === lang.code ? "bg-gray-100 font-semibold" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accessibility Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className="flex items-center gap-1 px-1 sm:px-2 py-1 rounded hover:bg-black/10 transition-colors text-[10px] sm:text-xs"
                >
                  <span className="text-sm sm:text-base">♿</span>
                  <span className="hidden sm:inline">Accessibility</span>
                  <span className="sm:hidden">A11y</span>
                </button>
                {showAccessibility && (
                  <div className="absolute right-0 mt-2 z-50">
                    <AccessibilityTools language={language}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Left Logos */}
          <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 md:gap-6 w-full lg:w-1/4">
            <img 
              src="/ashok_emblem.png" 
              alt="Indian Emblem" 
              className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain" 
            />
            <a href='https://phd.maharashtra.gov.in/en/' target="_blank" rel="noopener noreferrer">
              <img 
                src="/logo.png" 
                alt="Maharashtra Emblem" 
                className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain" 
              />
            </a>
          </div>

          {/* Center: Office Names */}
          <div className="text-center w-full lg:w-1/2 px-2">
            <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-black leading-tight">
              जिल्हा शल्य चिकित्सक कार्यालय, सिंधुदुर्ग
            </h1>
            <h1 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-bold text-black uppercase leading-tight mt-1">
              CIVIL SURGEON OFFICE, SINDHUDURG
            </h1>
          </div>

          {/* Right Logos */}
          <div className="flex items-center justify-center lg:justify-end gap-2 sm:gap-4 md:gap-6 w-full lg:w-1/4">
            <a href='https://www.digitalindia.gov.in/' target="_blank" rel="noopener noreferrer">
              <img 
                src="/logo1.jpg" 
                alt="Digital India" 
                className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" 
              />
            </a>
            <a href='https://aaplesarkar.mahaonline.gov.in/en' target="_blank" rel="noopener noreferrer">
              <img 
                src="/logo2.png" 
                alt="Aaple Sarkar" 
                className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" 
              />
            </a>
            <img 
              src="/logo4.png" 
              alt="Logo 4" 
              className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;