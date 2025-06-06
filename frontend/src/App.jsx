// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import { useState, useEffect } from 'react';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;