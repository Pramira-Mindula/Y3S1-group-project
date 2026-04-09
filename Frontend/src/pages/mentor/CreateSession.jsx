import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .cs-root { font-family: 'DM Sans', sans-serif; }
  .cs-inp:focus, .cs-sel:focus {
    border-color: #ED93B1 !important;
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
    outline: none;
  }
  .cs-inp::placeholder { color: #B4B2A9; font-weight: 300; }
  .cs-row:hover { background: #fdf5f8 !important; }
`;

const STATUS_STYLE = {
  Available: { bg: '#E1F5EE', color: '#0F6E56', dot: '#1D9E75' },
  Booked:    { bg: '#FBEAF0', color: '#993556', dot: '#D4537E' },
  Completed: { bg: '#F1EFE8', color: '#5F5E5A', dot: '#888780' },
  Cancelled: { bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A' },
};

export default function CreateSession() {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [date, setDate]           = useState('');
  const [time, setTime]           = useState('');
  const [reason, setReason]       = useState('');
  const [creating, setCreating]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchMySessions(); }, []);

  const isCallReady = (sessionDate) => {
    const diff = Math.abs(new Date() - new Date(sessionDate)) / (1000 * 60);
    return diff <= 15;
  };

  const joinCall = (sessionId) => navigate(`/video-call/${sessionId}`);

  const fetchMySessions = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSessions(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      toast.error('Failed to load your schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const slotDateTime = new Date(`${date}T${time}`).toISOString();
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/appointments',
        { date: slotDateTime, reason: reason || 'Available for mentoring session' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Availability slot added!');
      setSessions([...sessions, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setDate(''); setTime(''); setReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create slot.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Slot removed.');
      setSessions(sessions.filter(s => s._id !== id));
    } catch {
      toast.error('Failed to remove slot.');
    } finally {
      setConfirmId(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(
        import.meta.env.VITE_API_URL + `/appointments/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Session marked as ${newStatus}`);
      setSessions(sessions.map(s => s._id === id ? { ...s, status: newStatus } : s));
    } catch {
      toast.error('Failed to update session.');
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cs-root flex flex-col items-center justify-center py-24 gap-4">
          <div className="rounded-full border-2 animate-spin"
            style={{ width: 36, height: 36, borderColor: '#5DCAA5', borderTopColor: 'transparent' }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#2C2C2A' }}>Loading your schedule…</p>
        </div>
      </>
    );
  }

  const booked    = sessions.filter(s => s.status === 'Booked').length;
  const available = sessions.filter(s => s.status === 'Available').length;
  const completed = sessions.filter(s => s.status === 'Completed').length;

  return (
    <>
      <style>{styles}</style>
      <div className="cs-root">

        {/* Page Header */}
        <div className="mb-6">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Schedule</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 700, color: '#2C2C2A', marginBottom: 4 }}>
            My <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Schedule</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#5F5E5A', fontWeight: 300 }}>Set your availability and manage upcoming mentorship sessions.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: '📅', label: 'Open Slots',     value: available, bg: '#E1F5EE', color: '#1D9E75' },
            { icon: '🤝', label: 'Booked',         value: booked,    bg: '#FBEAF0', color: '#D4537E' },
            { icon: '✅', label: 'Completed',       value: completed, bg: '#FAEEDA', color: '#EF9F27' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl"
              style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1rem 1.2rem' }}>
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-xl"
                style={{ width: 42, height: 42, background: s.bg }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.55rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#5F5E5A', fontWeight: 300, marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Availability Form */}
        <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: 'white', border: '0.5px solid #e8ddd8' }}>
          <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '0.5px solid #f0e8e4' }}>
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase' }}>Add Availability</span>
          </div>
          <div className="p-5">
            <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
              {/* Date */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                <label style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#5F5E5A' }}>Date</label>
                <input type="date" required
                  min={new Date().toISOString().split('T')[0]}
                  value={date} onChange={e => setDate(e.target.value)}
                  className="cs-inp"
                  style={{ padding: '0.7rem 0.95rem', border: '0.5px solid #e8ddd8', borderRadius: 13, fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", color: '#2C2C2A', background: '#fdf8f5', transition: 'border-color 0.2s' }}
                />
              </div>
              {/* Time */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <label style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#5F5E5A' }}>Time</label>
                <input type="time" required
                  value={time} onChange={e => setTime(e.target.value)}
                  className="cs-inp"
                  style={{ padding: '0.7rem 0.95rem', border: '0.5px solid #e8ddd8', borderRadius: 13, fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", color: '#2C2C2A', background: '#fdf8f5', transition: 'border-color 0.2s' }}
                />
              </div>
              {/* Topic */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                <label style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#5F5E5A' }}>Session Topic (optional)</label>
                <input type="text"
                  placeholder="e.g., Career advice, General mentoring"
                  value={reason} onChange={e => setReason(e.target.value)}
                  className="cs-inp"
                  style={{ padding: '0.7rem 0.95rem', border: '0.5px solid #e8ddd8', borderRadius: 13, fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", color: '#2C2C2A', background: '#fdf8f5', transition: 'border-color 0.2s' }}
                />
              </div>
              {/* Submit */}
              <button type="submit"
                disabled={creating || !date || !time}
                className="flex-shrink-0"
                style={{
                  padding: '0.72rem 1.5rem', borderRadius: 50, fontSize: '0.88rem',
                  fontWeight: 500, color: 'white', background: '#1D9E75',
                  border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  opacity: (creating || !date || !time) ? 0.55 : 1, whiteSpace: 'nowrap',
                  height: 42,
                }}
              >
                {creating ? 'Adding…' : '+ Add Slot'}
              </button>
            </form>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #e8ddd8' }}>
          {/* Table Head */}
          <div className="grid px-5 py-3"
            style={{ gridTemplateColumns: '1.3fr 1fr 2fr 1.6fr', background: '#2C2C2A', fontSize: '0.64rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888780' }}>
            <span>Date &amp; Time</span>
            <span>Status</span>
            <span>Mentee &amp; Focus</span>
            <span style={{ textAlign: 'center' }}>Actions</span>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span style={{ fontSize: '2.5rem' }}>📅</span>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#2C2C2A', fontWeight: 700 }}>No slots yet</p>
              <p style={{ fontSize: '0.85rem', color: '#5F5E5A', fontWeight: 300 }}>Add your availability above to get started.</p>
            </div>
          ) : sessions.map(session => {
            const st = STATUS_STYLE[session.status] || STATUS_STYLE.Available;
            const d  = new Date(session.date);
            return (
              <div key={session._id} className="cs-row grid px-5 py-4 items-center"
                style={{ gridTemplateColumns: '1.3fr 1fr 2fr 1.6fr', borderBottom: '0.5px solid #f5efec', background: 'white', transition: 'background 0.15s' }}>

                {/* Date Block */}
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 44, height: 44, background: '#fdf8f5', border: '0.5px solid #e8ddd8' }}>
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#D4537E', fontWeight: 500, letterSpacing: '0.07em' }}>
                      {d.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#2C2C2A', lineHeight: 1 }}>
                      {d.getDate()}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#2C2C2A' }}>
                    {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status */}
                <span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
                    style={{ background: st.bg, fontSize: '0.67rem', fontWeight: 500, color: st.color, letterSpacing: '0.06em' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
                    {session.status}
                  </span>
                </span>

                {/* Mentee */}
                <div>
                  {session.status === 'Available' ? (
                    <span style={{ fontSize: '0.82rem', color: '#B4B2A9', fontStyle: 'italic', fontWeight: 300 }}>
                      Waiting for a mentee…
                    </span>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 500, color: '#2C2C2A', marginBottom: 3 }}>
                        {session.userId?.username || 'Unknown Mentee'}
                      </p>
                      {session.reason && (
                        <p style={{ fontSize: '0.78rem', color: '#5F5E5A', fontWeight: 300, fontStyle: 'italic', paddingLeft: '0.6rem', borderLeft: '2px solid #ED93B1', lineHeight: 1.5 }}>
                          "{session.reason}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {session.status === 'Available' && (
                    <button onClick={() => setConfirmId(session._id)}
                      style={{ padding: '0.32rem 0.8rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', background: '#FCEBEB', color: '#A32D2D', border: '0.5px solid rgba(163,45,45,.2)', fontFamily: "'DM Sans', sans-serif" }}>
                      Remove
                    </button>
                  )}
                  {session.status === 'Booked' && (
                    <>
                      {isCallReady(session.date) ? (
                        <button onClick={() => joinCall(session._id)}
                          style={{ padding: '0.32rem 0.8rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', background: '#E1F5EE', color: '#0F6E56', border: '0.5px solid rgba(29,158,117,.3)', fontFamily: "'DM Sans', sans-serif" }}>
                          📹 Join Call
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#B4B2A9', fontStyle: 'italic' }}>
                          15 min before
                        </span>
                      )}
                      <button onClick={() => handleStatusUpdate(session._id, 'Completed')}
                        style={{ padding: '0.32rem 0.8rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', background: '#E1F5EE', color: '#0F6E56', border: '0.5px solid rgba(29,158,117,.3)', fontFamily: "'DM Sans', sans-serif" }}>
                        ✓ Done
                      </button>
                      <button onClick={() => handleStatusUpdate(session._id, 'Cancelled')}
                        style={{ padding: '0.32rem 0.8rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', background: '#FCEBEB', color: '#A32D2D', border: '0.5px solid rgba(163,45,45,.2)', fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel
                      </button>
                    </>
                  )}
                  {(session.status === 'Completed' || session.status === 'Cancelled') && (
                    <span style={{ fontSize: '0.7rem', color: '#B4B2A9', fontStyle: 'italic' }}>Finished</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          {sessions.length > 0 && (
            <div className="px-5 py-3 flex justify-between items-center" style={{ borderTop: '0.5px solid #f0e8e4', background: '#fdf8f5' }}>
              <span style={{ fontSize: '0.73rem', color: '#888780', fontWeight: 300 }}>{sessions.length} slot{sessions.length !== 1 ? 's' : ''} total</span>
              {booked > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#FBEAF0', color: '#993556', border: '0.5px solid rgba(212,83,126,.3)' }}>
                  🤝 {booked} session{booked !== 1 ? 's' : ''} booked
                </span>
              )}
            </div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {confirmId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(44,44,42,0.5)' }}
            onClick={e => { if (e.target === e.currentTarget) setConfirmId(null); }}>
            <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'white', border: '0.5px solid #e8ddd8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🗑️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#2C2C2A', marginBottom: '0.4rem' }}>Remove Slot?</h3>
              <p style={{ fontSize: '0.85rem', color: '#5F5E5A', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                This time slot will be permanently removed from your availability.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmId(null)}
                  style={{ padding: '0.6rem 1.3rem', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: 'none', border: '0.5px solid #e8ddd8', color: '#5F5E5A' }}>
                  Cancel
                </button>
                <button onClick={() => handleDeleteSlot(confirmId)}
                  style={{ padding: '0.6rem 1.4rem', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: '#E24B4A', color: 'white', border: 'none' }}>
                  Remove Slot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}