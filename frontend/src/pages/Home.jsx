
import { useNavigate } from 'react-router-dom';
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <div className="text-center animate-fade-in-down max-w-xl text-white">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight text-white">
          Welcome to Nightingale
        </h1>
        <p className="text-sm sm:text-lg mb-6 text-white">
          Reflect. Recharge. Write your thoughts.
        </p>
        <button onClick={() => navigate('/about')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-sm sm:text-base font-medium shadow-lg hover:scale-105 transform duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}
