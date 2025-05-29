import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About Nightingale</h1>
        <p className="mb-4">
          Inspired by Florence Nightingale’s legacy of healing and care, Nightingale is a
          modern journaling app designed to help you reflect, unwind, and grow.
        </p>
        <p className="mb-4">
          Backed by research showing that journaling can reduce stress, improve mood, and
          increase emotional clarity, Nightingale offers a serene night-time writing experience.
        </p>
        <p className="mb-4">
          Soon, our AI-powered reflections will offer personalized inspiration based on your
          entries — making your journal feel like it listens and cares.
        </p>
        <p className="italic text-sm text-gray-400">
          “Live life when you have it. Life is a splendid gift — there is nothing small in it.”
          – Florence Nightingale
        </p>
      </div>
    </div>
  );
};

export default About;
