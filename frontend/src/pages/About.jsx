import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="text-center animate-fade-in-down max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight leading-tight text-white">About Nightingale</h1>
        <div className="text-left">
          <p className="text-base sm:text-lg mb-6 text-white">
            Inspired by Florence Nightingale’s legacy of care, Nightingale is your private self-care journaling companion. Backed by science—74% of people who journal report reduced stress and anxiety, while 77% say it aids in self-discovery (<a href="https://habitbetter.com/journaling-for-stress-and-anxiety/" className="text-indigo-400 hover:text-indigo-500 transition-colors" target="_blank" rel="noopener noreferrer">Habitbetter, 2020</a>)—our app offers a serene night-time experience with AI-powered reflections that provide personalized inspiration, providing you with a journal that listens and cares.
          </p>
          <p className="text-base sm:text-lg mb-6 text-white">
            So whether you’ve had a great day or a tough one, Nightingale is a secure and safe space to reflect and grow. Start your self-care journey today!
          </p>
        </div>
        <p className="text-white italic text-m mb-6 text-center">
          “Our first journey is to find that special place for us.” – Florence Nightingale
        </p>
        <p className="text-gray-400 text-sm mb-1 text-center">
          **Registration Coming Soon**
        </p>
        <p className="text-gray-400 text-sm mb-4 text-center">
          Demo login is in README on GitHub:<br />
          <a href="https://github.com/Cyberbot777/nightingale" className="text-indigo-400 hover:text-indigo-500 transition-colors" target="_blank" rel="noopener noreferrer">https://github.com/Cyberbot777/nightingale</a>
        </p>
      </div>
    </div>
  );
};

export default About;