import { useState } from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Nightingale</h1>
      <p className="text-lg text-gray-300 mb-6">
        Reflect. Recharge. Write your thoughts. Let Nightingale guide your mind at dusk.
      </p>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all shadow-lg">
        Get Started
      </button>
    </div>
  );
}

export default App;
