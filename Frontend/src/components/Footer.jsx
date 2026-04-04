import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">EmpowerMent</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connecting ambitious minds with experienced guides. Your journey to personal and professional growth starts here.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-bold mb-2">Quick Links</h4>
          <Link to="/" className="text-sm hover:text-teal-400 transition">Home</Link>
          <Link to="/mentors" className="text-sm hover:text-teal-400 transition">Find a Guide</Link>
          <Link to="/login" className="text-sm hover:text-teal-400 transition">Mentor Login</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-bold mb-2">Support</h4>
          <Link to="/contact" className="text-sm hover:text-teal-400 transition">Contact Us</Link>
          <Link to="/privacy" className="text-sm hover:text-teal-400 transition">Privacy Policy</Link>
          <Link to="/terms" className="text-sm hover:text-teal-400 transition">Terms of Service</Link>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} EmpowerMent. All rights reserved.
      </div>
    </footer>
  );
}