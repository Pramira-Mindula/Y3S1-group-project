import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E; --rose-light: #FBEAF0; --rose-mid: #ED93B1;
    --teal: #1D9E75; --teal-light: #E1F5EE; --teal-mid: #5DCAA5;
    --dark: #2C2C2A; --muted: #5F5E5A; --surface: #fdf8f5; --white: #ffffff;
  }

  .fm-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 100vh;
    padding: 3rem 1.5rem 5rem;
    color: var(--dark);
  }

  .fm-inner { max-width: 1200px; margin: 0 auto; }

  .fm-page-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 2rem;
    margin-bottom: 3rem;
  }

  .fm-page-label {
    font-size: 0.75rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.5rem;
  }

  .fm-page-title {
    font-family: 'Playfair Display', serif; font-size: 2.2rem;
    font-weight: 700; color: var(--dark); line-height: 1.2; margin-bottom: 0.35rem;
  }

  .fm-page-title em { color: var(--rose); font-style: italic; }

  .fm-page-sub {
    font-size: 0.95rem; color: var(--muted); font-weight: 300; max-width: 500px;
  }

  .fm-back-link {
    font-size: 0.9rem; color: var(--teal);
    font-weight: 500; text-decoration: none;
    transition: color 0.2s;
  }

  .fm-back-link:hover { color: var(--rose); }

  .fm-search-box {
    background: var(--white);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border: 1px solid #e8ddd8;
    margin-bottom: 2rem;
  }

  .fm-search-input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #e8ddd8;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--dark);
    outline: none;
    transition: border-color 0.2s;
  }

  .fm-search-input:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
  }

  .fm-search-input::placeholder {
    color: var(--muted);
  }

  .fm-mentors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .fm-mentor-card {
    background: var(--white);
    border-radius: 14px;
    border: 1px solid #e8ddd8;
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
  }

  .fm-mentor-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--rose-mid);
  }

  .fm-mentor-header {
    background: linear-gradient(135deg, var(--rose-light) 0%, var(--teal-light) 100%);
    padding: 2rem 1.5rem;
    text-align: center;
  }

  .fm-mentor-avatar {
    font-size: 3.5rem;
    margin-bottom: 0.8rem;
  }

  .fm-mentor-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 0.25rem;
  }

  .fm-mentor-title {
    font-size: 0.85rem;
    color: var(--muted);
    font-style: italic;
  }

  .fm-mentor-body {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .fm-mentor-expertise {
    margin-bottom: 1.2rem;
  }

  .fm-expertise-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--teal);
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
  }

  .fm-expertise-text {
    font-size: 0.9rem;
    color: var(--dark);
    line-height: 1.5;
    font-weight: 300;
  }

  .fm-slots-section {
    margin-top: auto;
    border-top: 1px solid #e8ddd8;
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .fm-slots-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--teal);
    letter-spacing: 0.05em;
    margin-bottom: 0.6rem;
  }

  .fm-slots-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }

  .fm-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem;
    background: var(--surface);
    border-radius: 6px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .fm-slot:hover {
    background: var(--rose-light);
  }

  .fm-slot-time {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--dark);
  }

  .fm-slot-date {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 0.2rem;
  }

  .fm-slot-btn {
    background: var(--teal);
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .fm-slot-btn:hover {
    background: #135f4f;
  }

  .fm-no-slots {
    font-size: 0.85rem;
    color: var(--muted);
    font-style: italic;
    padding: 0.8rem;
    background: var(--surface);
    border-radius: 6px;
    text-align: center;
  }

  .fm-empty {
    text-align: center;
    padding: 3rem;
    background: var(--white);
    border-radius: 14px;
    border: 1px solid #e8ddd8;
  }

  .fm-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .fm-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 0.5rem;
  }

  .fm-empty-sub {
    font-size: 0.95rem;
    color: var(--muted);
    margin-bottom: 2rem;
  }

  .fm-loading {
    text-align: center;
    padding: 3rem;
    color: var(--teal);
    font-weight: 600;
  }

  .fm-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .fm-modal.open {
    display: flex;
  }

  .fm-modal-content {
    background: var(--white);
    border-radius: 14px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .fm-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
  }

  .fm-modal-slot-info {
    background: var(--surface);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .fm-modal-slot-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--teal);
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .fm-modal-slot-time {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark);
  }

  .fm-form-group {
    margin-bottom: 1.2rem;
  }

  .fm-form-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--dark);
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    display: block;
  }

  .fm-form-input,
  .fm-form-textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #e8ddd8;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--dark);
    outline: none;
    transition: border-color 0.2s;
  }

  .fm-form-input:focus,
  .fm-form-textarea:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
  }

  .fm-form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .fm-modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .fm-btn {
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .fm-btn-primary {
    background: var(--rose);
    color: white;
  }

  .fm-btn-primary:hover {
    background: #993556;
    transform: translateY(-1px);
  }

  .fm-btn-secondary {
    background: var(--surface);
    color: var(--dark);
    border: 1px solid #e8ddd8;
  }

  .fm-btn-secondary:hover {
    background: #f0e8e0;
  }

  @media (max-width: 768px) {
    .fm-mentors-grid {
      grid-template-columns: 1fr;
    }
    
    .fm-page-header {
      flex-direction: column;
    }
  }
`;

export default function FindMentor() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMentor, setExpandedMentor] = useState(null);
  const [slots, setSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingReason, setBookingReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + '/auth/mentors'
      );
      setMentors(response.data);
    } catch (error) {
      toast.error('Failed to load mentors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorSlots = async (mentorId) => {
    if (slots[mentorId]) {
      setExpandedMentor(expandedMentor === mentorId ? null : mentorId);
      return;
    }

    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/appointments/available/${mentorId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSlots(prev => ({ ...prev, [mentorId]: response.data }));
      setExpandedMentor(mentorId);
    } catch (error) {
      toast.error('Failed to load available slots');
      console.error(error);
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingReason('');
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!bookingReason.trim()) {
      toast.error('Please provide a reason for the session');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.patch(
        import.meta.env.VITE_API_URL + `/appointments/${selectedSlot._id}/book`,
        { reason: bookingReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Session booked successfully!');
      setSelectedSlot(null);
      setBookingReason('');
      
      // Refresh the slots
      const mentor = selectedSlot.mentorId._id || selectedSlot.mentorId;
      setSlots(prev => ({
        ...prev,
        [mentor]: slots[mentor].filter(s => s._id !== selectedSlot._id)
      }));

      // Redirect to mentee dashboard after 1 second
      setTimeout(() => navigate('/menteedash'), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to book session';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.mentorDetails?.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="fm-page">
          <div className="fm-inner">
            <div className="fm-loading">Loading available mentors...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="fm-page">
        <div className="fm-inner">

          {/* Page Header */}
          <div className="fm-page-header">
            <div>
              <div className="fm-page-label">Find Your Guide</div>
              <div className="fm-page-title">Browse <em>Mentors</em></div>
              <div className="fm-page-sub">
                Connect with experienced mentors who are ready to guide your journey.
                Choose your mentor and book an available session.
              </div>
            </div>
            <Link to="/menteedash" className="fm-back-link">← Back to Dashboard</Link>
          </div>

          {/* Search Box */}
          <div className="fm-search-box">
            <input
              type="text"
              className="fm-search-input"
              placeholder="Search by mentor name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Mentors Grid */}
          {filteredMentors.length === 0 ? (
            <div className="fm-empty">
              <div className="fm-empty-icon">🔍</div>
              <div className="fm-empty-title">No mentors found</div>
              <div className="fm-empty-sub">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No mentors are currently available. Please check back later.'}
              </div>
            </div>
          ) : (
            <div className="fm-mentors-grid">
              {filteredMentors.map((mentor) => (
                <div key={mentor._id} className="fm-mentor-card">
                  <div className="fm-mentor-header">
                    <div className="fm-mentor-avatar">👩‍💼</div>
                    <div className="fm-mentor-name">{mentor.username}</div>
                    <div className="fm-mentor-title">
                      {mentor.mentorDetails?.expertise || 'Mentor'}
                    </div>
                  </div>

                  <div className="fm-mentor-body">
                    <div className="fm-mentor-expertise">
                      <div className="fm-expertise-label">About</div>
                      <div className="fm-expertise-text">
                        {mentor.mentorDetails?.bio || 'Experienced mentor ready to help'}
                      </div>
                    </div>

                    <div className="fm-slots-section">
                      <div className="fm-slots-label">Available Slots</div>

                      {expandedMentor === mentor._id ? (
                        slots[mentor._id] && slots[mentor._id].length > 0 ? (
                          <div className="fm-slots-list">
                            {slots[mentor._id].map((slot) => (
                              <div
                                key={slot._id}
                                className="fm-slot"
                                onClick={() => handleBookSlot(slot)}
                              >
                                <div>
                                  <div className="fm-slot-time">
                                    {new Date(slot.date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div className="fm-slot-date">
                                    {new Date(slot.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <button
                                  className="fm-slot-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBookSlot(slot);
                                  }}
                                >
                                  Book
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="fm-no-slots">
                            No available slots at the moment
                          </div>
                        )
                      ) : (
                        <button
                          className="fm-slot-btn"
                          style={{ width: '100%' }}
                          onClick={() => fetchMentorSlots(mentor._id)}
                        >
                          View Available Slots
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <div className={`fm-modal ${selectedSlot ? 'open' : ''}`}>
        <div className="fm-modal-content">
          <div className="fm-modal-title">Book This Session</div>

          {selectedSlot && (
            <div className="fm-modal-slot-info">
              <div className="fm-modal-slot-label">Session Time</div>
              <div className="fm-modal-slot-time">
                {new Date(selectedSlot.date).toLocaleDateString()} at{' '}
                {new Date(selectedSlot.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitBooking}>
            <div className="fm-form-group">
              <label className="fm-form-label">What would you like to discuss?</label>
              <textarea
                className="fm-form-textarea"
                placeholder="e.g., Career guidance, technical skills, project review..."
                value={bookingReason}
                onChange={(e) => setBookingReason(e.target.value)}
                required
              />
            </div>

            <div className="fm-modal-actions">
              <button
                type="button"
                className="fm-btn fm-btn-secondary"
                onClick={() => setSelectedSlot(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="fm-btn fm-btn-primary"
                disabled={isSubmitting || !bookingReason.trim()}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
