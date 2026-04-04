import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  
  // Check if the user is logged in by looking for the token
  const isLoggedIn = !!localStorage.getItem('token'); 

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to the home page
  };

  return (
    <header className="bg-white shadow-sm border-b border-fuchsia-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-fuchsia-900 tracking-tight">
          Empower<span className="text-teal-600">Ment</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-teal-600 transition">Home</Link>
          <Link to="/menteedash" className="hover:text-teal-600 transition">Find a Mentor</Link>
          <Link to="/about" className="hover:text-teal-600 transition">About Us</Link>
        </nav>

        {/* Action Buttons (Conditional Rendering) */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            /* --- WHAT LOGGED-IN USERS SEE --- */
            <>
              <button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2 rounded-lg font-bold transition shadow-sm"
              >
                Log Out
              </button>

              <Link to="/profile" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2 rounded-lg font-bold transition shadow-sm">
                My Profile
              </Link>
              
            </>
          ) : (
            /* --- WHAT GUESTS (LOGGED-OUT USERS) SEE --- */
            <>
              <Link to="/login" className="text-teal-700 font-bold hover:text-teal-800 transition">
                Log In
              </Link>
              <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-bold transition shadow">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}