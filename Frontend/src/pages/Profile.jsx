import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E;
    --rose-light: #FBEAF0;
    --rose-mid: #ED93B1;
    --teal: #1D9E75;
    --teal-light: #E1F5EE;
    --teal-mid: #5DCAA5;
    --dark: #2C2C2A;
    --muted: #5F5E5A;
    --surface: #fdf8f5;
    --white: #ffffff;
  }

  .prof-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 100vh;
    padding: 3rem 1.5rem 5rem;
    color: var(--dark);
  }

  .prof-inner {
    max-width: 780px;
    margin: 0 auto;
  }

  /* PAGE HEADER */
  .prof-page-header {
    margin-bottom: 2.5rem;
  }
  .prof-page-label {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: var(--teal);
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .prof-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--dark);
    line-height: 1.2;
    margin-bottom: 0.4rem;
  }
  .prof-page-title em { color: var(--rose); font-style: italic; }
  .prof-page-sub {
    font-size: 0.95rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* CARD */
  .prof-card {
    background: var(--white);
    border-radius: 24px;
    border: 0.5px solid #e8ddd8;
    overflow: hidden;
  }

  /* BANNER */
  .prof-banner {
    background: var(--dark);
    padding: 3rem 2.5rem 5rem;
    position: relative;
    overflow: hidden;
  }
  .prof-banner::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 500px; height: 300px;
    background: radial-gradient(ellipse, rgba(212,83,126,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .prof-banner-decoration {
    position: absolute;
    bottom: -30px; right: -30px;
    width: 180px; height: 180px;
    border-radius: 50%;
    border: 40px solid rgba(237,147,177,0.07);
    pointer-events: none;
  }
  .prof-banner-decoration2 {
    position: absolute;
    top: -20px; left: -20px;
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 30px solid rgba(93,202,165,0.06);
    pointer-events: none;
  }

  /* AVATAR AREA */
  .prof-avatar-area {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    position: relative;
    z-index: 1;
  }
  .prof-avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: var(--rose-light);
    border: 3px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--rose);
    flex-shrink: 0;
    text-transform: uppercase;
  }
  .prof-avatar-info { padding-bottom: 2px; }
  .prof-username {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: white;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  .prof-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.3rem 0.9rem;
    border-radius: 50px;
  }
  .prof-role-badge.mentor {
    background: rgba(29,158,117,0.2);
    color: var(--teal-mid);
    border: 1px solid rgba(93,202,165,0.25);
  }
  .prof-role-badge.mentee {
    background: rgba(212,83,126,0.2);
    color: var(--rose-mid);
    border: 1px solid rgba(237,147,177,0.25);
  }
  .prof-role-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  /* BODY */
  .prof-body { padding: 0 2.5rem 2.5rem; }

  /* AVATAR OVERLAP */
  .prof-overlap {
    height: 44px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 0;
    margin-bottom: 1.5rem;
  }
  .prof-edit-btn {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--muted);
    background: var(--white);
    border: 0.5px solid #e8ddd8;
    padding: 0.45rem 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .prof-edit-btn:hover { border-color: var(--rose-mid); color: var(--rose); }

  /* SECTION LABEL */
  .prof-section-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 0.5px solid #f0e8e4;
  }

  /* INFO GRID */
  .prof-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .prof-field {
    background: var(--surface);
    border: 0.5px solid #e8ddd8;
    border-radius: 14px;
    padding: 1.1rem 1.3rem;
    transition: border-color 0.2s;
  }
  .prof-field:hover { border-color: #c5b8b0; }
  .prof-field-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.35rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .prof-field-icon { font-size: 12px; }
  .prof-field-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--dark);
    word-break: break-word;
  }
  .prof-field-value.empty { color: #B4B2A9; font-weight: 300; font-style: italic; }

  /* STATS ROW */
  .prof-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .prof-stat {
    background: var(--white);
    border: 0.5px solid #e8ddd8;
    border-radius: 14px;
    padding: 1.1rem;
    text-align: center;
  }
  .prof-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--rose);
    line-height: 1;
    margin-bottom: 4px;
  }
  .prof-stat-label {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 400;
  }

  /* ACTIONS */
  .prof-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .prof-btn-primary {
    font-size: 0.88rem;
    font-weight: 500;
    color: white;
    background: var(--rose);
    text-decoration: none;
    padding: 0.7rem 1.6rem;
    border-radius: 50px;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: inline-block;
  }
  .prof-btn-primary:hover { background: #993556; transform: translateY(-1px); }
  .prof-btn-secondary {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--dark);
    background: transparent;
    text-decoration: none;
    padding: 0.7rem 1.6rem;
    border-radius: 50px;
    border: 1px solid #e0d5cf;
    transition: all 0.2s;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: inline-block;
  }
  .prof-btn-secondary:hover { border-color: var(--rose-mid); color: var(--rose); }

  /* LOADING */
  .prof-loading {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--muted);
  }
  .prof-spinner {
    width: 36px; height: 36px;
    border: 2.5px solid var(--rose-light);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .prof-loading-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--dark);
  }
  .prof-loading-sub { font-size: 0.85rem; color: var(--muted); font-weight: 300; }

  @media (max-width: 600px) {
    .prof-grid { grid-template-columns: 1fr; }
    .prof-stats { grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
    .prof-banner { padding: 2rem 1.5rem 4rem; }
    .prof-body { padding: 0 1.5rem 2rem; }
    .prof-avatar { width: 72px; height: 72px; font-size: 1.8rem; }
    .prof-username { font-size: 1.4rem; }
    .prof-page-title { font-size: 1.8rem; }
  }
`;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfileDetails(); }, []);

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
      <>
        <style>{styles}</style>
        <div className="prof-loading">
          <div className="prof-spinner" />
          <div>
            <div className="prof-loading-text">Loading your profile…</div>
            <div className="prof-loading-sub" style={{ textAlign: 'center', marginTop: 4 }}>Just a moment</div>
          </div>
        </div>
      </>
    );
  }

  const isMentor = user?.role === 'mentor';
  const initials = user?.username?.charAt(0) || 'U';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;
  const yearsActive = memberYear ? new Date().getFullYear() - memberYear : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="prof-page">
        <div className="prof-inner">

          {/* Page Header */}
          <div className="prof-page-header">
            <div className="prof-page-label">Account</div>
            <div className="prof-page-title">My <em>Profile</em></div>
            <div className="prof-page-sub">Your personal account details and activity.</div>
          </div>

          {/* Card */}
          <div className="prof-card">

            {/* Banner */}
            <div className="prof-banner">
              <div className="prof-banner-decoration" />
              <div className="prof-banner-decoration2" />
              <div className="prof-avatar-area">
                <div className="prof-avatar">{initials}</div>
                <div className="prof-avatar-info">
                  <div className="prof-username">{user?.username}</div>
                  <span className={`prof-role-badge ${isMentor ? 'mentor' : 'mentee'}`}>
                    <span className="prof-role-dot" />
                    {isMentor ? 'Mentor Account' : 'Mentee Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="prof-body">

              {/* Edit row */}
              <div className="prof-overlap">
                <button className="prof-edit-btn">✏️ Edit Profile</button>
              </div>

              {/* Stats */}
              <div className="prof-section-label">Activity Overview</div>
              <div className="prof-stats">
                <div className="prof-stat">
                  <div className="prof-stat-num">{isMentor ? '12' : '4'}</div>
                  <div className="prof-stat-label">{isMentor ? 'Mentees' : 'Sessions'}</div>
                </div>
                <div className="prof-stat">
                  <div className="prof-stat-num">{yearsActive > 0 ? `${yearsActive}y` : '<1y'}</div>
                  <div className="prof-stat-label">Member</div>
                </div>
                <div className="prof-stat">
                  <div className="prof-stat-num">{isMentor ? '4.9' : '—'}</div>
                  <div className="prof-stat-label">{isMentor ? 'Rating' : 'No rating'}</div>
                </div>
              </div>

              {/* Account Info */}
              <div className="prof-section-label">Account Information</div>
              <div className="prof-grid">

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">👤</span> Username</div>
                  <div className="prof-field-value">{user?.username}</div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">✉️</span> Email Address</div>
                  <div className="prof-field-value">{user?.email}</div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">📞</span> Phone Number</div>
                  <div className={`prof-field-value${!user?.phone ? ' empty' : ''}`}>
                    {user?.phone || 'Not provided'}
                  </div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">📅</span> Member Since</div>
                  <div className="prof-field-value">{memberSince}</div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">🏷️</span> Account Role</div>
                  <div className="prof-field-value">{isMentor ? 'Mentor' : 'Mentee'}</div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-label"><span className="prof-field-icon">🔒</span> Account Status</div>
                  <div className="prof-field-value" style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', flexShrink: 0 }} />
                    Active
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="prof-section-label">Quick Actions</div>
              <div className="prof-actions">
                <Link to={isMentor ? '/mentordash' : '/menteedash'} className="prof-btn-primary">
                  {isMentor ? 'Go to Dashboard →' : 'Find a Mentor →'}
                </Link>
                <Link to="/resources" className="prof-btn-secondary">Browse Resources</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}