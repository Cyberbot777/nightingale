// frontend/src/pages/Journal.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api'; // Ensure this points to http://localhost:8000

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [editEntry, setEditEntry] = useState(null);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/journal?skip=0&limit=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setEntries(data);
        } else {
          setError(data.detail || 'Failed to fetch journal entries.');
        }
      } catch (err) {
        setError('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEntries();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setEntries([]);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await response.json();
      if (response.ok) {
        setEntries([...entries, { ...data, id: entries.length + 1, created_at: new Date().toISOString() }]);
        setNewEntry({ title: '', content: '' });
      } else {
        setError(data.detail || 'Failed to add journal entry.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editEntry),
      });

      const data = await response.json();
      if (response.ok) {
        setEntries(entries.map(entry => entry.id === id ? { ...entry, ...data } : entry));
        setEditEntry(null);
      } else {
        setError(data.detail || 'Failed to update journal entry.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id));
      } else {
        setError(data.detail || 'Failed to delete journal entry.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetFeedback = async (id) => {
    setLoading(true);
    setError('');
    setAiFeedback('');
    try {
      const response = await fetch(`${API_BASE_URL}/ai-feedback/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAiFeedback(data.feedback);
      } else {
        setError(data.detail || 'Failed to get AI feedback.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6">
        <div className="max-w-md mx-auto animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Login to Nightingale</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium shadow-lg disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">My Journal</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setToken('');
          }}
          className="mb-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors font-medium shadow-lg"
        >
          Logout
        </button>

        <form onSubmit={handleAddEntry} className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            className="w-full p-2 mb-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            placeholder="Write your thoughts here..."
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            className="w-full h-40 p-4 rounded-md bg-gray-800 text-white border border-gray-700 resize-none mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
        </form>

        <div>
          {entries.length === 0 ? (
            <p className="text-gray-400 italic">No journal entries found.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
                {editEntry && editEntry.id === entry.id ? (
                  <div>
                    <input
                      type="text"
                      value={editEntry.title}
                      onChange={(e) => setEditEntry({ ...editEntry, title: e.target.value })}
                      className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      value={editEntry.content}
                      onChange={(e) => setEditEntry({ ...editEntry, content: e.target.value })}
                      className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleUpdateEntry(entry.id)}
                      className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-full transition-colors font-medium mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditEntry(null)}
                      className="px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    <p className="text-gray-300">{entry.content}</p>
                    <p className="text-gray-400 text-sm"><small>{new Date(entry.created_at).toLocaleString()}</small></p>
                    <button
                      onClick={() => setEditEntry({ id: entry.id, title: entry.title, content: entry.content })}
                      className="mt-2 mr-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="mt-2 mr-2 px-4 py-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleGetFeedback(entry.id)}
                      className="mt-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium"
                    >
                      Get AI Feedback
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
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