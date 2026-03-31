import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function FindMentor() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking States
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // 1. Fetch Verified Mentors on load
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/mentors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMentors(response.data);
    } catch (error) {
      toast.error('Failed to load mentors.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Available Slots when a Mentor is selected
  const handleSelectMentor = async (mentor) => {
    setSelectedMentor(mentor);
    setLoadingSlots(true);
    setSelectedSlotId('');
    
    try {
      // You need a backend route that gets slots where status === 'Available' for this mentorId
      const response = await axios.get(import.meta.env.VITE_API_URL + `/appointments/available/${mentor._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      toast.error("Could not load mentor's availability.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // 3. Book the Slot (PATCH request to your new controller)
  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) return toast.error("Please select a time slot.");
    setSubmitting(true);

    try {
      // Calls the bookAvailableSlot function from the previous step
      await axios.patch(import.meta.env.VITE_API_URL + `/appointments/${selectedSlotId}/book`, 
        { reason }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Session booked successfully!');
      
      // Redirect to the user's dashboard to see their booked session
      navigate('/mentee/dashboard'); 
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book session.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-fuchsia-600 font-bold">Loading Empowering Guides...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-fuchsia-50">
      <h2 className="text-3xl font-bold mb-2 text-fuchsia-900">Find a Guide</h2>
      <p className="text-fuchsia-700 mb-8 font-medium">Connect with verified mentors and book an available session.</p>
      
      {/* ---------------- MENTOR LIST (CARDS) ---------------- */}
      {!selectedMentor ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white p-6 rounded-xl shadow-sm border border-fuchsia-100 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{mentor.username}</h3>
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mt-2 inline-block">
                  {mentor.mentorDetails?.expertise || "General Support"}
                </span>
                <p className="text-sm text-gray-600 mt-4 italic line-clamp-3">
                  "{mentor.mentorDetails?.bio || "Ready to guide and empower you."}"
                </p>
              </div>
              <button 
                onClick={() => handleSelectMentor(mentor)}
                className="mt-6 w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded-lg font-bold transition shadow"
              >
                View Availability
              </button>
            </div>
          ))}
        </div>
      ) : (
        
        /* ---------------- BOOKING FORM ---------------- */
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-fuchsia-100">
          <button 
            onClick={() => setSelectedMentor(null)}
            className="text-sm text-gray-500 hover:text-fuchsia-600 font-bold mb-6 flex items-center gap-1"
          >
            ← Back to Mentors
          </button>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Book a Session</h3>
          <p className="text-gray-600 mb-6">with <span className="font-bold text-fuchsia-700">{selectedMentor.username}</span></p>
          
          <form onSubmit={handleBookSession} className="flex flex-col gap-6">
            
            {/* Slot Selection */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Available Times</label>
              {loadingSlots ? (
                <p className="text-sm text-teal-600 font-bold">Checking schedule...</p>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
                  This mentor currently has no available time slots. Please check back later.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map(slot => (
                    <div 
                      key={slot._id}
                      onClick={() => setSelectedSlotId(slot._id)}
                      className={`cursor-pointer p-3 rounded-lg border-2 text-center transition ${
                        selectedSlotId === slot._id 
                          ? 'border-teal-600 bg-teal-50 text-teal-800' 
                          : 'border-gray-200 hover:border-teal-300 text-gray-600'
                      }`}
                    >
                      <p className="font-bold text-sm">{new Date(slot.date).toLocaleDateString()}</p>
                      <p className="text-xs mt-1">{new Date(slot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Focus Area */}
            {availableSlots.length > 0 && (
              <>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-sm font-bold text-gray-700">Focus Area (Reason)</label>
                  <p className="text-xs text-gray-500 mb-1">What would you like to discuss? This is confidential.</p>
                  <textarea 
                    required rows="3"
                    placeholder="E.g., I need advice on career growth..."
                    value={reason} onChange={(e) => setReason(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" disabled={submitting || !selectedSlotId}
                  className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold text-lg transition disabled:bg-teal-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Booking...' : 'Confirm Session'}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}