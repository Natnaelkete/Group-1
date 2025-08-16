import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import advisorBot from '../assets/images/advisor.jpeg';
import detection from '../assets/images/crop.jpg';
import farmer from '../assets/images/farmer.jpeg';
import weather from '../assets/images/weather.png';
import bgVid from '../assets/bgVideo.mp4';

const LandingPage = () => {
  const phrases = [
    'አግሮLink',
    'የገበሬው ምርጥ ጓደኛ',
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setIsFading(true), 5000);
    const changeTimeout = setTimeout(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      setIsFading(false);
    }, 6000);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(changeTimeout);
    };
  }, [currentPhraseIndex]);

  const features = [
    {
      title: "Connect Buyers & Farmers",
      description: "Direct marketplace eliminating middlemen. Farmers get fair prices, buyers get fresh produce straight from source.",
      image: farmer,
      bgColor: "from-emerald-900/80 to-emerald-700/50",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      isPolygon: true,
      layout: 'side'
    },
    {
      title: "AI Crop Disease Detection",
      description: "Instant diagnosis from plant photos. Get treatment plans to save your crops before damage spreads.",
      image: detection,
      bgColor: "from-amber-900/80 to-amber-700/50",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      isPolygon: true,
      layout: 'side'
    },
    {
      title: "24/7 Farming Advisor",
      description: "Virtual agronomist in your pocket. Get personalized advice on soil health, pest control, and crop cycles in Amharic or Oromiffa.",
      image: advisorBot,
      bgColor: "from-purple-900/80 to-purple-700/50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      isPolygon: true,
      layout: 'side'
    },
    {
      title: "Hyper-Local Weather Alerts & Prediction",
      description: "Precision forecasts and future predictions for your exact location. We also offer soil moisture analysis",
      image: weather,
      bgColor: "from-blue-900/80 to-blue-700/50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      isPolygon: true,
      layout: 'side'
    }
  ];

  return (
    <div className="bg-gray-950 text-white font-sans overflow-x-hidden">
      {/* Header/Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 bg-gray-950/50 backdrop-blur-md">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            አግሮLink
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/#services" className="text-gray-300 hover:text-white transition-colors duration-300">
              Services
            </Link>
            <Link to="/sign-up" className="py-2 px-6 rounded-full font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={bgVid} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDQiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjwvcmVjdD48L3N2Zz4=')] z-10"></div>

        <div className="relative z-20 px-4 w-full">
          <h1 className={`text-5xl md:text-8xl font-bold mb-6 transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#81FBB8_0%,#28C76F_50%,#E2B0FF_100%)] bg-[length:200%_200%] animate-gradient">
              {phrases[currentPhraseIndex]}
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-gray-300 mb-10 font-light">
            <span className="inline-block px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-700">
              Farmer's Digital Companion
            </span>
          </p>

          <Link
            to="/sign-up"
            className="inline-block py-4 px-10 text-lg font-semibold bg-white/90 text-gray-900 rounded-full shadow-xl hover:bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started →
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-20">
          <span className="bg-clip-text text-transparent bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-emerald-400 via-blue-500 to-purple-600">
            Services
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative rounded-3xl overflow-hidden group"
              data-aos="fade-up"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} backdrop-blur-md border border-gray-700/30 rounded-3xl`}></div>
              
              {feature.layout === 'side' ? (
                // Side-by-side layout
                <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[400px]">
                  <div className="p-10 flex-1 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{feature.description}</p>
                    <Link
                      to="/services"
                      className={`self-start py-3 px-8 rounded-full font-medium transition-all ${feature.buttonColor} text-white hover:scale-105`}
                    >
                      Learn More
                    </Link>
                  </div>
                  <div className={`flex-1 relative overflow-hidden ${index % 2 === 0 ? 'order-first' : ''}`}>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${feature.isPolygon ? '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]' : ''}`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${feature.bgColor.split(' ')[0]}/80 via-transparent to-transparent`}></div>
                  </div>
                </div>
              ) : (
                // Stacked layout
                <div className="relative z-10 flex flex-col h-full items-center justify-center p-8">
                  <div className="w-full relative overflow-hidden flex-shrink-0 mb-6 h-[190px] md:h-80">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{feature.description}</p>
                    <Link
                      to="/services"
                      className={`inline-block py-3 px-8 rounded-full font-medium transition-all ${feature.buttonColor} text-white hover:scale-105`}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
