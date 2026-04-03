

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for creating a new slot
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchMySessions();
  }, []);

  // 1. Fetch all sessions for this mentor
  const fetchMySessions = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Sort sessions by date (newest/upcoming first)
      const sortedSessions = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSessions(sortedSessions);
    } catch (error) {
      toast.error('Failed to load your schedule.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create a new Available Slot
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const slotDateTime = new Date(`${date}T${time}`).toISOString();

      // Calls your new createAvailableSlot backend function
      const response = await axios.post(import.meta.env.VITE_API_URL + '/appointments', 
        { date: slotDateTime }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Availability slot added!');
      
      // Add the new slot to the UI and clear the form
      setSessions([...sessions, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setDate('');
      setTime('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create slot.');
    } finally {
      setCreating(false);
    }
  };

  // 3. Delete an empty slot (if mentor changes their mind)
  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Remove this available slot?")) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Slot removed.');
      setSessions(sessions.filter(session => session._id !== id));
    } catch (error) {
      toast.error('Failed to remove slot.');
    }
  };

  // 4. Update Status (Mark as Completed or Cancelled)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(import.meta.env.VITE_API_URL + `/appointments/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Session marked as ${newStatus}`);
      
      setSessions(sessions.map(session => 
        session._id === id ? { ...session, status: newStatus } : session
      ));
    } catch (error) {
      toast.error('Failed to update session.');
    }
  };

  if (loading) return <div className="p-6 text-center text-teal-600 font-bold">Loading your schedule...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-slate-50">
      <h2 className="text-3xl font-bold mb-2 text-slate-800">Mentor Schedule Manager</h2>
      <p className="text-slate-600 mb-8">Set your availability and manage your upcoming mentorship sessions.</p>

      {/* --- ADD NEW AVAILABILITY FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Availability</h3>
        <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-slate-700">Date</label>
            <input 
              type="date" required 
              min={new Date().toISOString().split('T')[0]} 
              value={date} onChange={(e) => setDate(e.target.value)}
              className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-slate-700">Time</label>
            <input 
              type="time" required 
              value={time} onChange={(e) => setTime(e.target.value)}
              className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button 
            type="submit" disabled={creating}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-bold transition disabled:bg-teal-400 h-[46px]"
          >
            {creating ? 'Adding...' : '+ Add Time Slot'}
          </button>
        </form>
      </div>

      {/* --- SCHEDULE TABLE --- */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-sm">
              <th className="p-4 w-1/4">Date & Time</th>
              <th className="p-4 w-1/4">Status</th>
              <th className="p-4 w-1/3">Mentee & Focus Area</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-500">You have no slots scheduled yet.</td></tr>
            ) : (
              sessions.map((session) => (
                <tr key={session._id} className="border-b hover:bg-slate-50 transition">
                  
                  <td className="p-4 text-sm text-slate-700 font-medium">
                    {new Date(session.date).toLocaleDateString()} <br/>
                    <span className="font-bold">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      session.status === 'Available' ? 'bg-green-100 text-green-700' :
                      session.status === 'Booked' ? 'bg-fuchsia-100 text-fuchsia-700' :
                      session.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>

                  <td className="p-4 text-sm">
                    {session.status === 'Available' ? (
                      <span className="text-slate-400 italic">Waiting for a mentee to book...</span>
                    ) : (
                      <div>
                        <p className="font-bold text-slate-800">{session.userId?.username || "Unknown User"}</p>
                        <p className="text-slate-600 italic mt-1 line-clamp-2">"{session.reason}"</p>
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-center space-x-2">
                    {/* Action Buttons based on Status */}
                    {session.status === 'Available' && (
                      <button onClick={() => handleDeleteSlot(session._id)} className="text-red-600 hover:text-red-800 text-sm font-bold underline">Delete Slot</button>
                    )}

                    {session.status === 'Booked' && (
                      <>
                        <button onClick={() => handleStatusUpdate(session._id, 'Completed')} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded shadow text-xs font-bold transition mb-1">Mark Completed</button>
                        <button onClick={() => handleStatusUpdate(session._id, 'Cancelled')} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded shadow-sm text-xs font-bold transition">Cancel</button>
                      </>
                    )}

                    {(session.status === 'Completed' || session.status === 'Cancelled') && (
                      <span className="text-slate-400 text-xs font-bold">Finished</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}