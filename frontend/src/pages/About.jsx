import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="text-center max-w-3xl animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">About Nightingale</h1>
        <p className="text-base sm:text-lg mb-4">
          Inspired by Florence Nightingale’s legacy of healing and care, Nightingale is a modern journaling app designed to help you reflect, unwind, and grow.
        </p>
        <p className="text-base sm:text-lg mb-4">
          Backed by research showing that journaling can reduce stress, improve mood, and increase emotional clarity, Nightingale offers a serene night-time writing experience.
        </p>
        <p className="text-base sm:text-lg mb-6">
          Our AI-powered reflections offer personalized inspiration based on your entries — making your journal feel like it listens and cares.
        </p>
        <p className="italic text-sm text-gray-400">
          “Live life when you have it. Life is a splendid gift — there is nothing small in it.” – Florence Nightingale
        </p>
        <p className="text-base sm:text-lg mt-6">
          **Registration Coming Soon**
        </p>
        <p className="text-base sm:text-lg mt-3">
          Login is under Usage Instructions on GitHub:
        </p>
        <a
          className="text-base sm:text-lg mb-6 text-blue-600 hover:underline cursor-pointer"
          href="https://github.com/Cyberbot777/nightingale"
          target="_blank"
        >
          https://github.com/Cyberbot777/nightingale
        </a>
      </div>
    </div>
  );
};

export default About;
