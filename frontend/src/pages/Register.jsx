import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 1. Register
      const res = await fetch("https://nightingale-backend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }

      // 2. Auto-login
      const loginRes = await fetch("https://nightingale-backend.onrender.com/login-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const loginData = await loginRes.json();
      localStorage.setItem("token", loginData.access_token);
      setToken(loginData.access_token);

      // Show success message
      setSuccess("Account created! Logging you in...");

      // Wait before redirecting so user sees the message
      setTimeout(() => {
        navigate("/journal");
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Register
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Join Nightingale and start reflecting nightly.
        </p>

        {success && (
          <div className="mb-4 text-center text-green-400 font-medium animate-fade-in-up transition-opacity duration-500">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 autofill:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Field with Eye */}
          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 autofill:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field with Eye */}
          <div>
            <label className="block text-sm mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 autofill:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Repeat your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

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
