'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
  '/assets/resort1/hero.png',
  '/assets/resort1/hero2.jpeg',
  '/assets/resort1/hero3.png',

];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const scrollNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image}
              alt={`Amwaj Resort ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col bg-gradient-to-t from-black/20 via-black/20 to-transparent font-sans text-[#f0fcff] items-center justify-center text-center px-4 z-20">

        <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-400  to-white/90 text-5xl md:text-6xl lg:text-8xl font-sans bg-black/50 py-2 md:py-10 relative z-30 font-bold tracking-tight " style={{ WebkitTextStroke: '1px #1b1b1b70' }}>
          AMWAJ RESORTS
        </h1>
        <p className="max-w-xl mx-auto mb-5 lg:text-2xl text-base md:text-xl text-neutral-400 mt-1 text-center">
          استمتع بإقامة فاخرة مع مسبح خاص وشاطئ خاص
        </p>
        <a
          href="#resorts"
          className="bg-[#070a11] hover:bg-[#161921] text-white rounded-lg text-md font-medium px-4 py-2 transition-all duration-300 hover:scale-105 shadow-3xl shadow-[#222838] flex items-center gap-1"
        >
          صيفك علينا
          <span className="text-xl inline-block animate-spin" style={{ animationDuration: '3s' }}>
            🔆
          </span>
        </a>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all flex items-center justify-center text-white shadow-lg"
        aria-label="السابق"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all flex items-center justify-center text-white shadow-lg"
        aria-label="التالي"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`الذهاب إلى الصورة ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}