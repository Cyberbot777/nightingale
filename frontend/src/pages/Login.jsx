import React, { useState } from 'react';
import { API_BASE_URL } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        navigate('/journal');
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Login</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Access your private journaling space.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={addLoading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium transition-colors hover:scale-105 transform duration-300 disabled:opacity-50"
          >
            {addLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="text-yellow-300 mt-2 font-sans text-sm text-center">{error}</p>}
        
        {/* 👇 Forgot password link added here */}
        <p className="text-sm text-center text-gray-400 mt-4">
          <a href="/forgot-password" className="hover:text-indigo-400">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}
