import React, { useState, useEffect } from 'react';
import bgVid from '../assets/bgVideo.mp4'; // Correct import
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const phrases = [
    'አግሮLink',
    'የገበሬው ምርጥ አጋር',
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, 5000); // Text fades after 5s

    const changePhraseTimeout = setTimeout(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      setIsFading(false);
    }, 6000); // Phrase changes after 6s

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(changePhraseTimeout);
    };
  }, [currentPhraseIndex, phrases.length]);

  return (
    <div className="bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={bgVid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-30 z-10"></div>

        {/* Text Content */}
        <div className="relative z-20 px-4">
          <h1
            className={`text-4xl md:text-7xl font-bold leading-tight mb-4 transition-opacity duration-1000 ease-in-out font-display ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
              {phrases[currentPhraseIndex]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-light max-w-2xl mx-auto">
            Farmer’s Best Partner
          </p>

          {/* Call to Action */}
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