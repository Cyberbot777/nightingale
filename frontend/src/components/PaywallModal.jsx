import React from "react";

export default function PaywallModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Unlock Premium Features
        </h2>

        <p className="text-gray-700 text-center mb-6">
          Choose a plan that works for you:
        </p>

        <div className="space-y-4">
          <a
            href="https://square.link/u/2kE5a3yh"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200"
          >
            Monthly Plan – $4.99/month
          </a>

          <a
            href="https://square.link/u/jcn1HdcF"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-xl transition duration-200"
          >
            Yearly Plan – $49.99/year
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-center text-sm text-gray-600 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
