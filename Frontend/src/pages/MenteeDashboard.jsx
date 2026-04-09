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

  .md-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 100vh;
    padding: 3rem 1.5rem 5rem;
    color: var(--dark);
  }

  .md-inner { max-width: 1000px; margin: 0 auto; }

  /* PAGE HEADER */
  .md-page-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem;
    margin-bottom: 2.8rem; flex-wrap: wrap;
  }
  .md-page-label {
    font-size: 0.75rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .md-page-title {
    font-family: 'Playfair Display', serif; font-size: 2.2rem;
    font-weight: 700; color: var(--dark); line-height: 1.2; margin-bottom: 0.35rem;
  }
  .md-page-title em { color: var(--rose); font-style: italic; }
  .md-page-sub { font-size: 0.95rem; color: var(--muted); font-weight: 300; }

  .md-book-btn {
    font-size: 0.88rem; font-weight: 500; color: white;
    background: var(--rose); text-decoration: none;
    padding: 0.7rem 1.6rem; border-radius: 50px;
    transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
    display: inline-block;
  }
  .md-book-btn:hover { background: #993556; transform: translateY(-1px); }

  /* STATS ROW */
  .md-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 2rem;
  }
  .md-stat {
    background: var(--white); border: 0.5px solid #e8ddd8;
    border-radius: 16px; padding: 1.2rem 1.4rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .md-stat-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .si-rose { background: var(--rose-light); }
  .si-teal { background: var(--teal-light); }
  .si-amber { background: #FAEEDA; }
  .md-stat-num {
    font-family: 'Playfair Display', serif; font-size: 1.6rem;
    font-weight: 700; color: var(--dark); line-height: 1;
  }
  .md-stat-lbl { font-size: 0.72rem; color: var(--muted); font-weight: 300; margin-top: 2px; }

  /* SESSIONS CARD */
  .md-sessions-card {
    background: var(--white); border-radius: 22px;
    border: 0.5px solid #e8ddd8; overflow: hidden;
  }
  .md-card-header {
    padding: 1.4rem 2rem;
    border-bottom: 0.5px solid #f0e8e4;
    display: flex; align-items: center; justify-content: space-between;
  }
  .md-card-title {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
  }
  .md-session-count {
    background: var(--rose-light); color: var(--rose);
    font-size: 0.72rem; font-weight: 500; padding: 0.2rem 0.75rem;
    border-radius: 50px;
  }

  /* EMPTY STATE */
  .md-empty {
    padding: 4rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center;
  }
  .md-empty-icon { font-size: 3.5rem; margin-bottom: 1.2rem; }
  .md-empty-title {
    font-family: 'Playfair Display', serif; font-size: 1.4rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.5rem;
  }
  .md-empty-sub {
    font-size: 0.9rem; color: var(--muted); font-weight: 300;
    max-width: 360px; line-height: 1.65; margin-bottom: 2rem;
  }
  .md-empty-btn {
    font-size: 0.9rem; font-weight: 500; color: white;
    background: var(--teal); text-decoration: none;
    padding: 0.8rem 2rem; border-radius: 50px;
    transition: all 0.2s; display: inline-block;
  }
  .md-empty-btn:hover { background: #0F6E56; transform: translateY(-1px); }

  /* SESSION ROW */
  .md-session-row {
    padding: 1.6rem 2rem;
    border-bottom: 0.5px solid #f5efec;
    display: flex; align-items: center; gap: 1.5rem;
    flex-wrap: wrap; transition: background 0.18s;
  }
  .md-session-row:last-child { border-bottom: none; }
  .md-session-row:hover { background: #fdf5f8; }

  /* DATE BLOCK */
  .md-date-block {
    min-width: 68px; text-align: center;
    background: var(--surface); border: 0.5px solid #e8ddd8;
    border-radius: 14px; padding: 0.7rem 0.5rem; flex-shrink: 0;
  }
  .md-date-month { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--rose); font-weight: 500; }
  .md-date-day { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: var(--dark); line-height: 1; }
  .md-date-time { font-size: 0.65rem; color: var(--muted); font-weight: 300; margin-top: 2px; }

  /* SESSION INFO */
  .md-session-info { flex: 1; min-width: 180px; }
  .md-session-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; flex-wrap: wrap; }

  .md-status-badge {
    font-size: 0.65rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 0.22rem 0.75rem; border-radius: 50px;
  }
  .status-booked { background: var(--teal-light); color: #0F6E56; }
  .status-completed { background: #F1EFE8; color: #5F5E5A; }
  .status-cancelled { background: #FCEBEB; color: #A32D2D; }

  .md-session-mentor {
    font-family: 'Playfair Display', serif; font-size: 1.05rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.4rem;
  }
  .md-session-reason {
    font-size: 0.83rem; color: var(--muted); font-weight: 300;
    font-style: italic; padding-left: 0.75rem;
    border-left: 2px solid var(--rose-mid); line-height: 1.5;
  }

  /* JOIN BUTTON AREA */
  .md-join-area { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0; }
  .md-join-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.88rem; font-weight: 500; color: white;
    background: var(--teal); border: none; padding: 0.65rem 1.4rem;
    border-radius: 50px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; text-decoration: none; white-space: nowrap;
  }
  .md-join-btn:hover { background: #0F6E56; transform: translateY(-1px); }
  .md-join-hint { font-size: 0.7rem; color: var(--muted); font-weight: 300; }

  /* LOADING */
  .md-loading {
    min-height: 100vh; background: var(--surface);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    font-family: 'DM Sans', sans-serif;
  }
  .md-spinner {
    width: 36px; height: 36px; border: 2.5px solid var(--rose-light);
    border-top-color: var(--rose); border-radius: 50%;
    animation: mdspin 0.8s linear infinite;
  }
  @keyframes mdspin { to { transform: rotate(360deg); } }
  .md-loading-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--dark); }
  .md-loading-sub { font-size: 0.85rem; color: var(--muted); font-weight: 300; }

  @media (max-width: 640px) {
    .md-stats { grid-template-columns: 1fr 1fr; }
    .md-stats .md-stat:last-child { grid-column: span 2; }
    .md-page-title { font-size: 1.8rem; }
    .md-session-row { gap: 1rem; }
    .md-join-area { align-items: flex-start; width: 100%; }
    .md-join-btn { width: 100%; justify-content: center; }
  }
`;

export default function MenteeDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const normalizeMeetingUrl = (link) => {
    if (!link || typeof link !== 'string') return '';
    const trimmed = link.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  // Check if session is ready for call (within 15 minutes before to 15 minutes after)
  const isCallReady = (sessionDate) => {
    const now = new Date();
    const session = new Date(sessionDate);
    const timeDiff = Math.abs(now - session);
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff <= 15; // Ready if within 15 minutes
  };

  const handleJoinCall = (session) => {
    if (isCallReady(session.date)) {
      // Use internal video call for P2P video
      navigate(`/video-call/${session._id}`);
    } else {
      // Show legacy meeting link if not yet time for call
      const meetingLink = normalizeMeetingUrl(session?.mentorId?.mentorDetails?.meetingLink);
      if (!meetingLink) {
        toast.error('Call will be available 15 minutes before the session starts');
        return;
      }
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => { fetchMyBookedSessions(); }, []);

  const fetchMyBookedSessions = async () => {
    try {
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

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="md-loading">
          <div className="md-spinner" />
          <div>
            <div className="md-loading-title">Loading your journey…</div>
            <div className="md-loading-sub" style={{ textAlign: 'center', marginTop: 4 }}>Just a moment</div>
          </div>
        </div>
      </>
    );
  }

  const bookedCount = sessions.filter(s => s.status === 'Booked').length;
  const completedCount = sessions.filter(s => s.status === 'Completed').length;

  const getStatusClass = (status) => {
    if (status === 'Booked') return 'status-booked';
    if (status === 'Completed') return 'status-completed';
    return 'status-cancelled';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="md-page">
        <div className="md-inner">

          {/* Page Header */}
          <div className="md-page-header">
            <div>
              <div className="md-page-label">Dashboard</div>
              <div className="md-page-title">My Learning <em>Journey</em></div>
              <div className="md-page-sub">Manage your upcoming mentorship sessions.</div>
            </div>
            <Link to="/findmentor" className="md-book-btn">+ Book New Session</Link>
          </div>

          {/* Stats Row */}
          <div className="md-stats">
            <div className="md-stat">
              <div className="md-stat-icon si-rose">📅</div>
              <div>
                <div className="md-stat-num">{bookedCount}</div>
                <div className="md-stat-lbl">Upcoming Sessions</div>
              </div>
            </div>
            <div className="md-stat">
              <div className="md-stat-icon si-teal">✅</div>
              <div>
                <div className="md-stat-num">{completedCount}</div>
                <div className="md-stat-lbl">Completed</div>
              </div>
            </div>
            <div className="md-stat">
              <div className="md-stat-icon si-amber">⭐</div>
              <div>
                <div className="md-stat-num">{sessions.length}</div>
                <div className="md-stat-lbl">Total Sessions</div>
              </div>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="md-sessions-card">
            <div className="md-card-header">
              <div className="md-card-title">All Sessions</div>
              {sessions.length > 0 && (
                <span className="md-session-count">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="md-empty">
                <div className="md-empty-icon">🌱</div>
                <div className="md-empty-title">No sessions booked yet</div>
                <div className="md-empty-sub">
                  You haven't scheduled any time with a mentor. Find a guide to start your growth journey.
                </div>
                <Link to="/findmentor" className="md-empty-btn">Find a Mentor →</Link>
              </div>
            ) : (
              sessions.map((session) => {
                const date = new Date(session.date);
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const day = date.toLocaleDateString('en-US', { day: 'numeric' });
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={session._id} className="md-session-row">

                    {/* Date Block */}
                    <div className="md-date-block">
                      <div className="md-date-month">{month}</div>
                      <div className="md-date-day">{day}</div>
                      <div className="md-date-time">{time}</div>
                    </div>

                    {/* Session Info */}
                    <div className="md-session-info">
                      <div className="md-session-top">
                        <span className={`md-status-badge ${getStatusClass(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="md-session-mentor">
                        with {session.mentorId?.username || 'Unknown Mentor'}
                      </div>
                      {session.reason && (
                        <div className="md-session-reason">
                          "{session.reason}"
                        </div>
                      )}
                    </div>

                    {/* Join Button */}
                    {session.status === 'Booked' && (
                      <div className="md-join-area">
                        <button
                          type="button"
                          className="md-join-btn"
                          onClick={() => handleJoinCall(session)}
                        >
                          🎥 Join Call
                        </button>
                        <span className="md-join-hint">Opens in new tab</span>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  );
}