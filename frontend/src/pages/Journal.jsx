import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [editEntry, setEditEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [hasJournaledToday, setHasJournaledToday] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(`${API_BASE_URL}/journal?skip=${skip}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const updatedEntries = data.map(entry => ({
          ...entry,
          hasFeedback: !!entry.feedback, // Ensure hasFeedback is true only if feedback exists
          feedback: entry.feedback || '',
          displayedFeedback: entry.feedback || '',
          isTyping: false,
          isExpanded: false,
        }));
        setEntries(updatedEntries);

        const today = new Date().toISOString().split('T')[0];
        const journaledToday = updatedEntries.some(entry => 
          new Date(entry.created_at).toISOString().split('T')[0] === today
        );
        setHasJournaledToday(journaledToday);

        setHasMore(data.length === limit);
      } else {
        setError(data.detail || 'Failed to fetch journal entries.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token, page, limit]);

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
    setPage(1);
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
        setNewEntry({ title: '', content: '' });
        setPage(1);
        await fetchEntries();
        setError('Entry saved successfully.');
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
        setError('Entry updated successfully.');
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
        if (entries.length === 1 && page > 1) {
          setPage(page - 1);
        }
        setError('Entry deleted successfully.');
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
    try {
      const response = await fetch(`${API_BASE_URL}/ai-feedback/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const entryIndex = entries.findIndex(entry => entry.id === id);
        const updatedEntries = [...entries];
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          hasFeedback: true,
          feedback: data.feedback,
          displayedFeedback: '',
          isTyping: true,
        };
        setEntries(updatedEntries);

        let currentText = '';
        const fullText = data.feedback;
        const typingSpeed = 50;
        for (let i = 0; i <= fullText.length; i++) {
          await new Promise(resolve => setTimeout(resolve, typingSpeed));
          currentText = fullText.substring(0, i);
          setEntries(prevEntries => {
            const newEntries = [...prevEntries];
            newEntries[entryIndex] = {
              ...newEntries[entryIndex],
              displayedFeedback: currentText,
            };
            return newEntries;
          });
        }

        setEntries(prevEntries => {
          const newEntries = [...prevEntries];
          newEntries[entryIndex] = {
            ...newEntries[entryIndex],
            isTyping: false,
          };
          return newEntries;
        });
      } else {
        setError(data.detail || 'Failed to get AI feedback.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
    ));
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
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
        <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2 text-center">My Journal</h1>
        <p className="text-gray-400 italic text-center mb-6">A Nightly Reflection with Florence Nightingale</p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setToken('');
            setPage(1);
          }}
          className="mb-4 px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-full transition-colors font-medium shadow-lg"
        >
          Logout
        </button>

        {!hasJournaledToday && (
          <p className="text-gray-400 italic text-center mb-4">Reflect on your day with Florence’s Light</p>
        )}

        <form onSubmit={handleAddEntry} className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-md shadow-md">
          <input
            type="text"
            placeholder="A title for your thoughts..."
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            className="w-full p-2 mb-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />
          <textarea
            placeholder="What’s on your mind tonight?"
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            className="w-full h-40 p-4 rounded-md bg-gray-800 text-white border border-gray-700 resize-none mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-900 to-yellow-600 hover:from-blue-800 hover:to-yellow-500 rounded-full transition-colors font-medium shadow-lg disabled:opacity-50"
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
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{entry.title}</h3>
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="text-yellow-300 hover:text-yellow-400 transition-colors"
                  >
                    {entry.isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                {entry.isExpanded ? (
                  <>
                    {editEntry && editEntry.id === entry.id ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={editEntry.title}
                          onChange={(e) => setEditEntry({ ...editEntry, title: e.target.value })}
                          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        />
                        <textarea
                          value={editEntry.content}
                          onChange={(e) => setEditEntry({ ...editEntry, content: e.target.value })}
                          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
                      <div className="mt-2">
                        <p className="text-gray-300">{entry.content}</p>
                        <p className="text-gray-400 text-sm italic"><small>{new Date(entry.created_at).toLocaleString()}</small></p>
                        {entry.hasFeedback && (
                          <div className="mt-2 p-2 bg-gray-700 border border-yellow-300 rounded-md">
                            <p className="text-gray-200 font-semibold">Nightingale’s Wisdom:</p>
                            <p className="text-gray-100">{entry.displayedFeedback}</p>
                            {entry.isTyping && <span className="animate-pulse text-yellow-300">...</span>}
                          </div>
                        )}
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
                          disabled={entry.hasFeedback}
                          className="mt-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title={entry.hasFeedback ? "Feedback Received" : "Request Nightingale's Wisdom"}
                        >
                          Nightingale’s Wisdom
                        </button>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-900 to-purple-900 hover:from-blue-800 hover:to-purple-800 rounded-full transition-colors font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-yellow-300 text-lg">Page {page}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="px-4 py-2 bg-gradient-to-r from-blue-900 to-purple-900 hover:from-blue-800 hover:to-purple-800 rounded-full transition-colors font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Journal;