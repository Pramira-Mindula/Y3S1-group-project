import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function MenteeDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeMeetingUrl = (link) => {
    if (!link || typeof link !== 'string') return '';
    const trimmed = link.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const handleJoinCall = (session) => {
    const meetingLink = normalizeMeetingUrl(session?.mentorId?.mentorDetails?.meetingLink);

    if (!meetingLink) {
      toast.error('Mentor has not added a Google Meet link yet.');
      return;
    }

    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    fetchMyBookedSessions();
  }, []);

  const fetchMyBookedSessions = async () => {
    try {
      // Fetch appointments where userId matches the logged-in user
      const response = await axios.get(import.meta.env.VITE_API_URL + '/appointments/my-sessions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to load your upcoming sessions.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-fuchsia-600 font-bold min-h-screen bg-fuchsia-50">Loading your sessions...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-fuchsia-50">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-fuchsia-900">My Learning Journey</h2>
          <p className="text-fuchsia-700 font-medium">Manage your upcoming mentorship sessions.</p>
        </div>
        <Link to="/findmentor" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-sm hidden sm:block">
          + Book New Session
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-fuchsia-100 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No sessions booked yet</h3>
            <p className="text-gray-500 mb-6 max-w-md">You haven't scheduled any time with a mentor. Find a guide to start your growth journey.</p>
            <Link to="/findmentor" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md">
              Find a Mentor
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-fuchsia-50">
            {sessions.map((session) => (
              <div key={session._id} className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:bg-slate-50 transition">
                
                {/* Session Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${
                      session.status === 'Booked' ? 'bg-fuchsia-100 text-fuchsia-800' :
                      session.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {session.status}
                    </span>
                    <p className="font-bold text-teal-700">
                      {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Meeting with {session.mentorId?.username || 'Unknown Mentor'}
                  </h3>
                  <p className="text-sm text-gray-600 italic border-l-2 border-fuchsia-200 pl-3 mt-2">
                    Focus: "{session.reason}"
                  </p>
                </div>

                {/* --- YOUR SNIPPET GOES EXACTLY HERE! --- */}
                {session.status === 'Booked' && (
                  <div className="md:text-right mt-4 md:mt-0 w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl border border-slate-100 md:border-none">
                    <button
                      type="button"
                      onClick={() => handleJoinCall(session)}
                      className="w-full md:w-auto inline-block text-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition transform hover:-translate-y-0.5"
                    >
                      🎥 Join Video Call
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Link opens in a new tab.
                    </p>
                  </div>
                )}
                {/* ----------------------------------------- */}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}