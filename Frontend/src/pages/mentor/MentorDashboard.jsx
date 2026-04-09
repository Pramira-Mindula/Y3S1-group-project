import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import CreateSession from './CreateSession';
import MentorProfile from './MentorProfile';
import { useState } from 'react';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/mentor') return location.pathname === '/mentor';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { to: '/mentor',          label: 'Dashboard',       icon: '◈' },
    { to: '/mentor/sessions', label: 'My Schedule',     icon: '📅' },
    { to: '/mentor/profile',  label: 'My Profile',      icon: '👤' },
  ];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: '#fdf8f5' }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? '250px' : '70px',
          background: '#2C2C2A',
          borderRight: '0.5px solid #3a3836',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
          style={{ borderBottom: '0.5px solid #3a3836', minHeight: '68px' }}
        >
          <span
            className="flex items-center justify-center rounded-xl font-bold flex-shrink-0"
            style={{ width: 36, height: 36, background: '#E1F5EE', color: '#1D9E75', fontFamily: "'Playfair Display', serif", fontSize: '1rem' }}
          >
            M
          </span>
          {sidebarOpen && (
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
              Empower<span style={{ color: '#ED93B1', fontStyle: 'italic' }}>Her</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 26, height: 26, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#888780', fontSize: 12, cursor: 'pointer' }}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Mentor Badge */}
        {sidebarOpen && (
          <div className="px-4 py-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(29,158,117,0.15)', color: '#5DCAA5', border: '0.5px solid rgba(93,202,165,0.25)', letterSpacing: '0.07em' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5DCAA5', display: 'inline-block' }} />
              Mentor Panel
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl transition-all"
              style={{
                padding: sidebarOpen ? '0.6rem 0.9rem' : '0.6rem',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                background: isActive(item.to) ? 'rgba(29,158,117,0.15)' : 'transparent',
                border: isActive(item.to) ? '0.5px solid rgba(29,158,117,0.25)' : '0.5px solid transparent',
                color: isActive(item.to) ? '#5DCAA5' : '#888780',
                fontWeight: isActive(item.to) ? 500 : 400,
                fontSize: '0.88rem', textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '0.5px solid #3a3836' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl transition-all"
            style={{
              padding: sidebarOpen ? '0.6rem 0.9rem' : '0.6rem',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              color: '#888780', fontSize: '0.88rem',
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{ height: '68px', background: 'rgba(253,248,245,0.97)', borderBottom: '0.5px solid #e8ddd8' }}
        >
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: 2 }}>
              Mentor
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#2C2C2A' }}>
              Mentor <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Dashboard</span>
            </p>
          </div>
          <div
            className="flex items-center justify-center rounded-full font-bold"
            style={{ width: 36, height: 36, background: '#E1F5EE', color: '#1D9E75', fontFamily: "'Playfair Display', serif", fontSize: '1rem', border: '1.5px solid #5DCAA5' }}
          >
            M
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<MentorHome />} />
            <Route path="sessions" element={<CreateSession />} />
            <Route path="profile"  element={<MentorProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function MentorHome() {
  return (
    <div>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Overview</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#2C2C2A', marginBottom: '2rem' }}>
        Welcome <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Back</span>
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '📅', label: 'Open Slots',      value: '—', bg: '#E1F5EE', color: '#1D9E75' },
          { icon: '🤝', label: 'Active Sessions',  value: '—', bg: '#FBEAF0', color: '#D4537E' },
          { icon: '✅', label: 'Completed',        value: '—', bg: '#FAEEDA', color: '#EF9F27' },
        ].map(s => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-2xl"
            style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1.2rem 1.4rem' }}
          >
            <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-xl"
              style={{ width: 46, height: 46, background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#5F5E5A', fontWeight: 300, marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#5F5E5A', fontWeight: 500, textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.7rem', borderBottom: '0.5px solid #f0e8e4' }}>
        Quick Actions
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: '/mentor/sessions', icon: '📅', label: 'Manage Schedule',  sub: 'Add availability and manage sessions' },
          { to: '/mentor/profile',  icon: '👤', label: 'Update Profile',   sub: 'Edit your bio, expertise and links' },
        ].map(q => (
          <a
            key={q.to}
            href={q.to}
            className="flex items-center gap-3 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1.2rem 1.4rem', textDecoration: 'none' }}
          >
            <span className="text-2xl flex-shrink-0">{q.icon}</span>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#2C2C2A', marginBottom: 2 }}>{q.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#5F5E5A', fontWeight: 300 }}>{q.sub}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}