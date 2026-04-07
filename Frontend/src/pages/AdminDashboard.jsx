import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminAllPosts from './CommunityPosts/AdminAllPosts';
// import AdminMentorAdd from './AdminMentorAdd'; // 💡 ඔයා තාම මේ ෆයිල් එක හැදුවේ නැත්නම් මේක මෙහෙම Comment කරලා තියන්න
import AdminReportManagement from './admin/AdminReportManagement';
import AdminResourceManager from './admin/AdminResourceManager';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { to: '/admin',            label: 'Dashboard',          icon: '◈' },
    { to: '/admin/users',      label: 'User Management',    icon: '👥' },
    { to: '/admin/reports',    label: 'Report Management',  icon: '📊' },
    { to: '/admin/resources',  label: 'Resource Manager',   icon: '📚' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: '#fdf8f5' }}>

      {/* ── SIDEBAR ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? '260px' : '72px',
          background: '#2C2C2A',
          borderRight: '0.5px solid #3a3836',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: '0.5px solid #3a3836', minHeight: '68px' }}
        >
          <span
            className="flex-shrink-0 flex items-center justify-center rounded-xl text-lg font-bold"
            style={{ width: 36, height: 36, background: '#FBEAF0', color: '#D4537E' }}
          >
            E
          </span>
          {sidebarOpen && (
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
              Empower<span style={{ color: '#ED93B1', fontStyle: 'italic' }}>Her</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto flex-shrink-0 flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#888780', fontSize: 13 }}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Admin badge */}
        {sidebarOpen && (
          <div className="px-5 py-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(212,83,126,0.15)', color: '#ED93B1', border: '0.5px solid rgba(237,147,177,0.2)', letterSpacing: '0.07em' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ED93B1', display: 'inline-block' }} />
              Admin Panel
            </span>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl transition-all"
              style={{
                padding: sidebarOpen ? '0.6rem 0.9rem' : '0.6rem',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                background: isActive(item.to) ? 'rgba(212,83,126,0.15)' : 'transparent',
                border: isActive(item.to) ? '0.5px solid rgba(212,83,126,0.25)' : '0.5px solid transparent',
                color: isActive(item.to) ? '#ED93B1' : '#888780',
                fontWeight: isActive(item.to) ? 500 : 400,
                fontSize: '0.88rem',
                textDecoration: 'none',
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
              color: '#888780',
              fontSize: '0.88rem',
              fontWeight: 400,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{
            height: '68px',
            background: 'rgba(253,248,245,0.97)',
            borderBottom: '0.5px solid #e8ddd8',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: 2 }}>
              Control Centre
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#2C2C2A' }}>
              Admin <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Dashboard</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full text-sm font-bold"
              style={{ width: 36, height: 36, background: '#FBEAF0', color: '#D4537E', fontFamily: "'Playfair Display', serif", border: '1.5px solid #ED93B1' }}
            >
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>

            {/* Dashboard Home */}
            <Route index element={
              <div>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Overview</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#2C2C2A', marginBottom: '2rem' }}>
                  Welcome <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Back</span>
                </h2>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: '👥', label: 'Total Users',     value: '48K+', color: '#FBEAF0', text: '#D4537E' },
                    { icon: '🤝', label: 'Active Mentors',  value: '1,200', color: '#E1F5EE', text: '#1D9E75' },
                    { icon: '📚', label: 'Resources',       value: '340',   color: '#FAEEDA', text: '#EF9F27' },
                    { icon: '📊', label: 'Reports',         value: '27',    color: '#E6F1FB', text: '#378ADD' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-4 rounded-2xl"
                      style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1.3rem 1.5rem' }}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0 text-xl"
                        style={{ width: 48, height: 48, background: s.color }}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: s.text, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#5F5E5A', marginTop: 3, fontWeight: 300 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Links */}
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#5F5E5A', fontWeight: 500, textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.7rem', borderBottom: '0.5px solid #f0e8e4' }}>
                  Quick Actions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { to: '/admin/users',     icon: '👥', label: 'Manage Users',     sub: 'View and control all accounts' },
                    { to: '/admin/reports',   icon: '📊', label: 'View Reports',      sub: 'Review flagged content' },
                    { to: '/admin/resources', icon: '📚', label: 'Edit Resources',    sub: 'Add or update library items' },
                  ].map((q) => (
                    <Link
                      key={q.to}
                      to={q.to}
                      className="flex items-center gap-3 rounded-2xl transition-all"
                      style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1.2rem 1.4rem', textDecoration: 'none' }}
                    >
                      <span className="text-2xl flex-shrink-0">{q.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#2C2C2A', marginBottom: 2 }}>{q.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#5F5E5A', fontWeight: 300 }}>{q.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            } />

            <Route path="users"     element={<AdminUserManagement />} />
            <Route path="reports"   element={<AdminReportManagement />} />
            <Route path="resources" element={<AdminResourceManager />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}