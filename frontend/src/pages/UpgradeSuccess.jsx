import React from "react";
import { useNavigate } from "react-router-dom";

export default function UpgradeSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-4">🎉 You're Premium!</h1>
      <p className="text-lg text-center max-w-md mb-6">
        Thank you for upgrading. You now have unlimited access to AI feedback
        and all premium features.
      </p>
      <button
        onClick={() => navigate("/journal")}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-medium transition duration-200"
      >
        Go to Journal
      </button>
    </div>
  );
}
