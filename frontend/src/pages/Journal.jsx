import React from 'react';

const Journal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">My Journal</h1>
        
        <textarea
          placeholder="Write your thoughts here..."
          className="w-full h-60 p-4 rounded-md bg-gray-800 text-white border border-gray-700 resize-none mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium shadow-lg">
            Get AI Feedback
          </button>
        </div>

        {/* Placeholder for AI feedback */}
        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
          <p className="text-gray-300 italic">AI feedback will appear here after submission.</p>
        </div>
      </div>
    </div>
  );
};

export default Journal;
