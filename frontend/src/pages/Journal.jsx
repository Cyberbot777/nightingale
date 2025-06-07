import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";
import PaywallModal from "../components/PaywallModal";

const Journal = ({ token, setToken }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [editEntry, setEditEntry] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [hasJournaledToday, setHasJournaledToday] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    setAddLoading(false);
    setLoadingStates({});
    setError("");
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(
        `${API_BASE_URL}/journal?skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedEntries = data.map((entry) => ({
          ...entry,
          hasFeedback: !!entry.feedback,
          feedback: entry.feedback || "",
          displayedFeedback: entry.feedback || "",
          isTyping: false,
          isExpanded: false,
        }));
        setEntries(updatedEntries);

        const today = new Date().toISOString().split("T")[0];
        const journaledToday = updatedEntries.some(
          (entry) =>
            new Date(entry.created_at).toISOString().split("T")[0] === today
        );
        setHasJournaledToday(journaledToday);

        setHasMore(data.length === limit);
      } else {
        setError(data.detail || "Failed to fetch journal entries.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token, page, limit]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await response.json();
      if (response.ok) {
        setNewEntry({ title: "", content: "" });
        setPage(1);
        await fetchEntries();
      } else {
        setError(data.detail || "Failed to add journal entry.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateEntry = async (id) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], edit: true },
    }));
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editEntry),
      });

      const data = await response.json();
      if (response.ok) {
        setEntries(
          entries.map((entry) =>
            entry.id === id ? { ...entry, ...data } : entry
          )
        );
        setEditEntry(null);
      } else {
        setError(data.detail || "Failed to update journal entry.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], edit: false },
      }));
    }
  };

  const handleDeleteEntry = async (id) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], delete: true },
    }));
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== id));
        if (entries.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } else {
        setError(data.detail || "Failed to delete journal entry.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: false },
      }));
      setShowDeleteModal(false);
      setEntryToDelete(null);
    }
  };

  const handleGetFeedback = async (id) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], feedback: true },
    }));
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/ai-feedback/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const entryIndex = entries.findIndex((entry) => entry.id === id);
        const updatedEntries = [...entries];
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          hasFeedback: true,
          feedback: data.feedback,
          displayedFeedback: "",
          isTyping: true,
        };
        setEntries(updatedEntries);

        let currentText = "";
        const fullText = data.feedback;
        const typingSpeed = 50;
        for (let i = 0; i <= fullText.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, typingSpeed));
          currentText = fullText.substring(0, i);
          setEntries((prevEntries) => {
            const newEntries = [...prevEntries];
            newEntries[entryIndex] = {
              ...newEntries[entryIndex],
              displayedFeedback: currentText,
            };
            return newEntries;
          });
        }

        setEntries((prevEntries) => {
          const newEntries = [...prevEntries];
          newEntries[entryIndex] = {
            ...newEntries[entryIndex],
            isTyping: false,
          };
          return newEntries;
        });
      } else {
        setError(data.detail || "Failed to get AI feedback.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], feedback: false },
      }));
    }
  };

  const toggleExpand = (id) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
      )
    );
  };

  const confirmDelete = (id) => {
    setEntryToDelete(id);
    setShowDeleteModal(true);
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900">
        <div className="text-center animate-fade-in-down max-w-xl text-white">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight text-white">
            My Journal
          </h1>
          <p className="text-sm sm:text-lg mb-6 text-white">
            Thanks for journaling. Sleep well.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">
          My Journal
        </h1>

        {hasJournaledToday && (
          <p className="text-gray-400 italic text-sm mb-4 text-center">
            Reflect on your day with Nightingale's Wisdom
          </p>
        )}
        {/* <div className="mb-4 text-center">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-white">Upgrade to Premium</span>{" "}
            for unlimited journaling and full Nightingale Wisdom.
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-2 text-blue-400 underline hover:text-blue-300 transition"
            >
              Learn more →
            </button>
          </p>
        </div> */}

        {/* <div className="mb-4 text-center">
  <span
    onClick={() => setIsModalOpen(true)}
    className="text-white text-sm hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
  >
    Upgrade to Premium →
  </span>
</div> */}


        <form
          onSubmit={handleAddEntry}
          className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-md shadow-md"
        >
          <input
            type="text"
            placeholder="A title for your thoughts..."
            value={newEntry.title}
            onChange={(e) =>
              setNewEntry({ ...newEntry, title: e.target.value })
            }
            className="w-full p-2 mb-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            placeholder="What’s on your mind tonight?"
            value={newEntry.content}
            onChange={(e) =>
              setNewEntry({ ...newEntry, content: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddEntry(e);
              }
            }}
            className="w-full h-40 p-4 rounded-md bg-gray-800 text-white border border-gray-700 resize-none mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50"
            >
              {addLoading ? "Saving..." : "Add Entry"}
            </button>
          </div>
          {error && (
            <p className="text-yellow-300 mt-2 font-sans text-sm">{error}</p>
          )}
        </form>

        <div>
          {entries.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              No journal entries found.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    {entry.title}
                  </h3>
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="text-yellow-300 hover:text-yellow-400 transition-colors"
                  >
                    {entry.isExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>
                {entry.isExpanded ? (
                  <>
                    {editEntry && editEntry.id === entry.id ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={editEntry.title}
                          onChange={(e) =>
                            setEditEntry({
                              ...editEntry,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                          value={editEntry.content}
                          onChange={(e) =>
                            setEditEntry({
                              ...editEntry,
                              content: e.target.value,
                            })
                          }
                          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleUpdateEntry(entry.id)}
                          disabled={loadingStates[entry.id]?.edit}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 mr-2 disabled:opacity-50"
                        >
                          {loadingStates[entry.id]?.edit ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditEntry(null)}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-gray-300 text-base sm:text-lg">
                          {entry.content}
                        </p>
                        <p className="text-gray-400 text-sm italic">
                          <small>
                            {new Date(entry.created_at).toLocaleString()}
                          </small>
                        </p>
                        {entry.hasFeedback && (
                          <div className="mt-2 p-2 bg-gray-700 border border-yellow-300 rounded-md">
                            <p className="text-gray-200 font-semibold text-base sm:text-lg">
                              Nightingale’s Wisdom:
                            </p>
                            <p className="text-gray-100 text-base sm:text-lg">
                              {entry.displayedFeedback}
                            </p>
                            {entry.isTyping && (
                              <span className="animate-pulse text-yellow-300">
                                ...
                              </span>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() =>
                            setEditEntry({
                              id: entry.id,
                              title: entry.title,
                              content: entry.content,
                            })
                          }
                          className="mt-2 mr-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(entry.id)}
                          disabled={loadingStates[entry.id]?.delete}
                          className="mt-2 mr-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50"
                        >
                          {loadingStates[entry.id]?.delete
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                        <button
                          onClick={() => handleGetFeedback(entry.id)}
                          disabled={
                            entry.hasFeedback ||
                            loadingStates[entry.id]?.feedback
                          }
                          className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            entry.hasFeedback
                              ? "Feedback Received"
                              : "Request Nightingale's Wisdom"
                          }
                        >
                          {loadingStates[entry.id]?.feedback
                            ? "Loading..."
                            : "Nightingale’s Wisdom"}
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
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-yellow-300 text-lg">Page {page}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold text-white mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6">
                Are you sure you want to delete this journal entry?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(entryToDelete)}
                  disabled={loadingStates[entryToDelete]?.delete}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300 disabled:opacity-50"
                >
                  {loadingStates[entryToDelete]?.delete
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
