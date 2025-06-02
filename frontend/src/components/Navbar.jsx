import { Link } from 'react-router-dom';

export default function Navbar({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <nav className="w-full bg-gray-950 text-white shadow-md animate-fade-in-down">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-wide">Nightingale</div>
        <div className="space-x-6 text-sm sm:text-base">
          <Link to="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link>
          <Link to="/journal" className="hover:text-indigo-400 transition-colors duration-200">Journal</Link>
          <Link to="/about" className="hover:text-indigo-400 transition-colors duration-200">About</Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-400 transition-colors duration-200">Login</Link>
              {/* <Link to="/register" className="hover:text-indigo-400 transition-colors duration-200">Register</Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}