import React, { useState, useEffect } from 'react';
import heroVideo from '../assets/Hero.mp4'; // Make sure the path is correct
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const phrases = [
    'አግሮLink',
    'የገበሬው ምርጥ አጋር',
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start the fade-out effect
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, 3000); // Wait 3 seconds before fading out

    // Change the phrase after the fade-out completes
    const changePhraseTimeout = setTimeout(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      setIsFading(false);
    }, 3500); // 3.5 seconds to account for fade duration

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(changePhraseTimeout);
    };
  }, [currentPhraseIndex, phrases.length]);

  return (
    <div className="bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Background Video */}
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
            src={heroVideo} 
          />
          {/* Gradient Overlay for visual hierarchy */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-80"></div>
        </div>

        <div 
          className="relative z-10 p-8 md:p-16 max-w-5xl mx-auto rounded-xl shadow-2xl transition-transform duration-500 ease-out"
    
        >
          <h1 
            className={`text-4xl md:text-7xl font-bold leading-tight mb-4 transition-opacity duration-500 ease-in-out font-display ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
              {phrases[currentPhraseIndex]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-light max-w-2xl mx-auto">
  Farmer’s Best Partner          </p>

          <Link
            to="/sign-up" 
            className="inline-block py-3 px-8 text-lg font-semibold bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

 
    </div>
  );
};

export default LandingPage;