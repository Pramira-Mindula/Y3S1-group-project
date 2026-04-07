import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .aum-wrap { font-family: 'DM Sans', sans-serif; }
`;

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Fetch Users Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/auth/verify-mentor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Mentor approved successfully!');
      setUsers(users.map(user =>
        user._id === userId
          ? { ...user, mentorDetails: { ...user.mentorDetails, isVerified: true } }
          : user
      ));
    } catch (error) {
      toast.error('Approval failed!');
      console.error('Approve Error:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('User deleted successfully!');
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user!');
      console.error('Delete Error:', error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const totalUsers   = users.length;
  const totalMentors = users.filter(u => u.role === 'mentor').length;
  const pending      = users.filter(u => u.role === 'mentor' && !u.mentorDetails?.isVerified).length;

  const getRoleBadge = (role) => {
    if (role === 'admin')  return 'bg-purple-50 text-purple-700 border border-purple-200';
    if (role === 'mentor') return 'bg-blue-50 text-blue-700 border border-blue-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const getInitial = (name) => (name?.charAt(0) || 'U').toUpperCase();

  const avatarColors = [
    { bg: '#FBEAF0', color: '#D4537E' },
    { bg: '#E1F5EE', color: '#1D9E75' },
    { bg: '#FAEEDA', color: '#EF9F27' },
    { bg: '#E6F1FB', color: '#378ADD' },
    { bg: '#EEEDFE', color: '#7F77DD' },
  ];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="aum-wrap flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="rounded-full border-2 border-t-transparent animate-spin"
            style={{ width: 36, height: 36, borderColor: '#ED93B1', borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#2C2C2A' }}>
            Loading users…
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="aum-wrap">

        {/* Page Header */}
        <div className="mb-6">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>
            Admin
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 700, color: '#2C2C2A', marginBottom: 4 }}>
            User &amp; Mentor <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Management</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#5F5E5A', fontWeight: 300 }}>
            View, approve, and manage all platform accounts.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: '👥', label: 'Total Users',     value: totalUsers,   bg: '#FBEAF0', color: '#D4537E' },
            { icon: '🤝', label: 'Active Mentors',  value: totalMentors, bg: '#E1F5EE', color: '#1D9E75' },
            { icon: '⏳', label: 'Pending Approval', value: pending,      bg: '#FAEEDA', color: '#EF9F27' },
          ].map(s => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl"
              style={{ background: 'white', border: '0.5px solid #e8ddd8', padding: '1.1rem 1.3rem' }}
            >
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0 text-xl"
                style={{ width: 44, height: 44, background: s.bg }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#5F5E5A', fontWeight: 300, marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Search */}
          <div className="relative flex items-center flex-1" style={{ minWidth: 200 }}>
            <span className="absolute left-3 text-sm" style={{ color: '#888780', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full"
              style={{
                padding: '0.6rem 1rem 0.6rem 2.2rem',
                border: '0.5px solid #e8ddd8', borderRadius: 50,
                fontSize: '0.87rem', fontFamily: "'DM Sans', sans-serif",
                color: '#2C2C2A', background: 'white', outline: 'none',
              }}
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex gap-2">
            {['all', 'user', 'mentor', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '0.45rem 1rem', borderRadius: 50,
                  fontSize: '0.8rem', fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  border: roleFilter === r ? 'none' : '0.5px solid #e8ddd8',
                  background: roleFilter === r ? '#2C2C2A' : 'white',
                  color: roleFilter === r ? 'white' : '#5F5E5A',
                  transition: 'all 0.18s',
                }}
              >
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #e8ddd8' }}>

          {/* Table Header */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: '2fr 2.5fr 1fr 1.2fr 1.4fr',
              background: '#2C2C2A',
              fontSize: '0.68rem', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888780',
            }}
          >
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span style={{ textAlign: 'center' }}>Actions</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span style={{ fontSize: '2.5rem' }}>👤</span>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#2C2C2A', fontWeight: 700 }}>
                No users found
              </p>
              <p style={{ fontSize: '0.85rem', color: '#5F5E5A', fontWeight: 300 }}>
                Try adjusting your search or filter.
              </p>
            </div>
          ) : filtered.map((user, i) => {
            const av = avatarColors[i % avatarColors.length];
            const isMentor   = user.role === 'mentor';
            const isVerified = user.mentorDetails?.isVerified;
            const isAdmin    = user.role === 'admin';

            return (
              <div
                key={user._id}
                className="grid items-center px-5 py-3.5 transition-colors"
                style={{
                  gridTemplateColumns: '2fr 2.5fr 1fr 1.2fr 1.4fr',
                  borderBottom: '0.5px solid #f5efec',
                  fontSize: '0.88rem',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fdf5f8'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: av.bg, color: av.color,
                      fontFamily: "'Playfair Display', serif", fontSize: '0.95rem',
                    }}
                  >
                    {getInitial(user.username)}
                  </div>
                  <span style={{ fontWeight: 500, color: '#2C2C2A' }}>{user.username}</span>
                </div>

                {/* Email */}
                <span style={{ color: '#5F5E5A', fontWeight: 300 }}>{user.email}</span>

                {/* Role Badge */}
                <span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getRoleBadge(user.role)}`}
                    style={{ fontSize: '0.65rem', letterSpacing: '0.07em' }}
                  >
                    {user.role}
                  </span>
                </span>

                {/* Status */}
                <span>
                  {isMentor ? (
                    isVerified ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#1D9E75' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#EF9F27' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF9F27', display: 'inline-block' }} />
                        Pending
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#1D9E75' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
                      Active
                    </span>
                  )}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">
                  {isMentor && !isVerified && (
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="transition-all"
                      style={{
                        padding: '0.35rem 0.85rem', borderRadius: 50,
                        fontSize: '0.75rem', fontWeight: 500,
                        fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                        background: '#E1F5EE', color: '#0F6E56',
                        border: '0.5px solid rgba(29,158,117,0.3)',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#1D9E75'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = '#E1F5EE'; e.target.style.color = '#0F6E56'; }}
                    >
                      ✓ Approve
                    </button>
                  )}
                  {!isAdmin ? (
                    <button
                      onClick={() => setConfirmDelete(user._id)}
                      className="transition-all"
                      style={{
                        padding: '0.35rem 0.85rem', borderRadius: 50,
                        fontSize: '0.75rem', fontWeight: 500,
                        fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                        background: '#FCEBEB', color: '#A32D2D',
                        border: '0.5px solid rgba(163,45,45,0.2)',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#E24B4A'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = '#FCEBEB'; e.target.style.color = '#A32D2D'; }}
                    >
                      Delete
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#B4B2A9', fontStyle: 'italic' }}>
                      Protected
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Count Footer */}
          {filtered.length > 0 && (
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: '0.5px solid #f0e8e4', background: '#fdf8f5' }}
            >
              <span style={{ fontSize: '0.75rem', color: '#888780', fontWeight: 300 }}>
                Showing {filtered.length} of {users.length} users
              </span>
              {pending > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#FAEEDA', color: '#854F0B', border: '0.5px solid rgba(239,159,39,0.3)' }}
                >
                  ⏳ {pending} mentor{pending !== 1 ? 's' : ''} awaiting approval
                </span>
              )}
            </div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(44,44,42,0.5)' }}
            onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null); }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'white', border: '0.5px solid #e8ddd8' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🗑️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#2C2C2A', marginBottom: '0.4rem' }}>
                Delete User?
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#5F5E5A', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.6rem' }}>
                This action is permanent and cannot be undone. The user's data and sessions will be removed from the platform.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    padding: '0.6rem 1.3rem', borderRadius: 50,
                    fontSize: '0.85rem', fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                    background: 'none', border: '0.5px solid #e8ddd8', color: '#5F5E5A',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  style={{
                    padding: '0.6rem 1.4rem', borderRadius: 50,
                    fontSize: '0.85rem', fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                    background: '#E24B4A', color: 'white', border: 'none',
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}