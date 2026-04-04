import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow bg-fuchsia-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        
        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          Your Growth Journey Starts Here
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-fuchsia-900 mb-6 leading-tight">
          Find the Perfect Mentor to <br/> Guide Your Path
        </h1>
        
        <p className="text-lg text-fuchsia-700 mb-10 max-w-2xl font-medium">
          Whether you are looking for career advice, skill development, or personal growth, our verified mentors are here to empower you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/mentors" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-lg font-bold text-lg transition shadow-lg transform hover:-translate-y-0.5">
            Find a Mentor
          </Link>
          <Link to="/register" className="bg-white hover:bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200 px-8 py-3.5 rounded-lg font-bold text-lg transition shadow-sm">
            Become a Mentor
          </Link>
        </div>

      </section>
    </main>
  );
}