// src/pages/Register.jsx
import React from 'react';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Register</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Join Nightingale and start reflecting nightly.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
