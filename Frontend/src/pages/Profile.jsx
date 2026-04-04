import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile data when the page loads
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load profile details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-fuchsia-600 font-bold min-h-screen bg-fuchsia-50 flex items-center justify-center">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-fuchsia-50">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-fuchsia-900">My Profile</h2>
        <p className="text-fuchsia-700 font-medium">View your personal account details.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 overflow-hidden">
        
        {/* Top Banner & Avatar */}
        <div className="bg-fuchsia-800 p-8 flex flex-col items-center text-center relative">
          <div className="w-24 h-24 bg-white text-fuchsia-800 rounded-full flex items-center justify-center text-4xl font-extrabold uppercase shadow-lg border-4 border-fuchsia-200 mb-4">
            {user?.username?.charAt(0) || 'U'}
          </div>
          <h3 className="text-2xl font-bold text-white">{user?.username}</h3>
          <span className="mt-2 inline-block bg-fuchsia-900/50 text-fuchsia-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-fuchsia-700">
            {user?.role === 'mentor' ? 'Mentor Account' : 'Mentee Account'}
          </span>
        </div>

        {/* User Details Grid */}
        <div className="p-8">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-b border-gray-100 pb-2">
            Account Information
          </h4>
          
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Username */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold mb-1">Username</p>
              <p className="font-semibold text-gray-800">{user?.username}</p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold mb-1">Email Address</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>

            {/* Phone (If applicable) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold mb-1">Phone Number</p>
              <p className="font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
            </div>
            {/* Account Created Date */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold mb-1">Member Since</p>
              <p className="font-semibold text-gray-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}