// frontend/src/pages/Journal.jsx

import React, { useState } from 'react';
import { API_BASE_URL } from '../api'; // Make sure this file exists!

const Journal = () => {
  const [entryText, setEntryText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: entryText })
      });

      const data = await response.json();
      if (response.ok) {
        setAiFeedback(data.feedback);
      } else {
        setError(data.detail || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">My Journal</h1>

        <textarea
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full h-60 p-4 rounded-md bg-gray-800 text-white border border-gray-700 resize-none mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGetFeedback}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium shadow-lg disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Get AI Feedback'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
          {error && <p className="text-red-400">{error}</p>}
          {!error && aiFeedback && (
            <p className="text-gray-100">{aiFeedback}</p>
          )}
          {!aiFeedback && !error && (
            <p className="text-gray-400 italic">AI feedback will appear here after submission.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
