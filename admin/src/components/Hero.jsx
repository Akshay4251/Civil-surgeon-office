// src/components/Hero.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient'; 

const SLIDE_DURATION = 6000; 

const Hero = ({ language = 'en' }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase.from('hero_slides').select('*').order('id');
      if (error) console.error("Error fetching slides:", error);
      else setSlides(data);
    };
    fetchSlides();
  }, []);

  const goToSlide = useCallback((slideIndex) => {
    setCurrentSlide(slideIndex);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    document.title = 'Civil Surgeon Office Sindhudurg | Quality Healthcare Services';

    const slideInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(slideInterval);
  }, [currentSlide, goToSlide, slides.length]);
  
  if (slides.length === 0) {
    return <section className="relative w-full h-auto lg:h-[90vh] bg-slate-200 animate-pulse"></section>;
  }

  return (
    <section className="relative w-full h-auto lg:h-[90vh] bg-slate-100 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.image_url})` }}
          />
        ))}
        <div className="absolute inset-0 w-full h-full bg-slate-100/30 backdrop-blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 z-20">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-white/40">
              <h1 className="text-xl md:text-3xl font-extrabold text-blue-900 leading-snug mb-4 h-24">
                {slides[currentSlide]?.title[language] || slides[currentSlide]?.title.en}
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Dedicated to providing exceptional healthcare services and fostering a healthy, thriving community.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`text-base md:text-lg font-bold transition-all ${
                    index === currentSlide ? 'text-pink-600 scale-125' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  0{index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 relative h-[40vh] md:h-[50vh] lg:h-[70vh]">
            <img
              src={slides[currentSlide]?.image_url}
              alt={slides[currentSlide]?.title[language] || slides[currentSlide]?.title.en}
              className="w-full h-full object-cover rounded-2xl shadow-xl transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;