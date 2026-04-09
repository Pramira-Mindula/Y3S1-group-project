import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .mp-root { font-family: 'DM Sans', sans-serif; }
  .mp-inp:focus, .mp-ta:focus {
    border-color: #ED93B1 !important;
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
    outline: none;
  }
  .mp-inp::placeholder, .mp-ta::placeholder { color: #B4B2A9; font-weight: 300; }
  .mp-inp:disabled { background: #f5efec !important; color: #B4B2A9 !important; cursor: not-allowed; }
`;

const Field = ({ label, children }) => (
  <div>
    <p style={{ fontSize: '0.67rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888780', marginBottom: 6 }}>{label}</p>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '0.5px solid #e8ddd8', borderRadius: 13,
  fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
  color: '#2C2C2A', background: '#fdf8f5', transition: 'border-color 0.2s',
};

export default function MentorProfile() {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [saving, setSaving]     = useState(false);

  const [formData, setFormData] = useState({
    username: '', phone: '', expertise: '', bio: '',
    experienceYears: '', meetingLink: '', linkedinUrl: '',
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const u = res.data;
      setUser(u);
      setFormData({
        username:        u.username || '',
        phone:           u.phone || '',
        expertise:       u.mentorDetails?.expertise || '',
        bio:             u.mentorDetails?.bio || '',
        experienceYears: u.mentorDetails?.experienceYears || '',
        meetingLink:     u.mentorDetails?.meetingLink || '',
        linkedinUrl:     u.mentorDetails?.linkedinUrl || '',
      });
    } catch { toast.error('Failed to load profile.'); }
    finally  { setLoading(false); }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const norm = (url) => {
      if (!url?.trim()) return '';
      return /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    };
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + '/auth/profile',
        {
          username: formData.username,
          phone:    formData.phone,
          mentorDetails: {
            expertise:       formData.expertise,
            bio:             formData.bio,
            experienceYears: formData.experienceYears,
            meetingLink:     norm(formData.meetingLink),
            linkedinUrl:     norm(formData.linkedinUrl),
          },
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Profile updated!');
      setUser(res.data.user || res.data);
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({
      username:        user.username || '',
      phone:           user.phone || '',
      expertise:       user.mentorDetails?.expertise || '',
      bio:             user.mentorDetails?.bio || '',
      experienceYears: user.mentorDetails?.experienceYears || '',
      meetingLink:     user.mentorDetails?.meetingLink || '',
      linkedinUrl:     user.mentorDetails?.linkedinUrl || '',
    });
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="mp-root flex flex-col items-center justify-center py-24 gap-4">
          <div className="rounded-full border-2 animate-spin"
            style={{ width: 36, height: 36, borderColor: '#5DCAA5', borderTopColor: 'transparent' }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#2C2C2A' }}>Loading profile…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="mp-root">

        {/* Page Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#1D9E75', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Account</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 700, color: '#2C2C2A', marginBottom: 4 }}>
              My <span style={{ color: '#D4537E', fontStyle: 'italic' }}>Profile</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#5F5E5A', fontWeight: 300 }}>Manage your personal details and mentorship focus.</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setEditing(true)}
              style={{ padding: '0.65rem 1.5rem', borderRadius: 50, fontSize: '0.88rem', fontWeight: 500, color: 'white', background: '#1D9E75', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #e8ddd8' }}>

          {/* Banner */}
          <div className="relative overflow-hidden" style={{ background: '#2C2C2A', padding: '2.5rem 2rem 4.5rem' }}>
            <div style={{ position: 'absolute', bottom: -35, right: -35, width: 160, height: 160, borderRadius: '50%', border: '40px solid rgba(237,147,177,0.07)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -20, left: -20, width: 110, height: 110, borderRadius: '50%', border: '28px solid rgba(93,202,165,0.07)', pointerEvents: 'none' }} />
            <div className="flex items-flex-end gap-4 relative z-10">
              <div className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 72, height: 72, background: '#E1F5EE', border: '3px solid rgba(255,255,255,0.12)', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#1D9E75' }}>
                {user?.username?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 6 }}>{user?.username}</h3>
                <p style={{ fontSize: '0.8rem', color: '#888780', fontWeight: 300, marginBottom: 8 }}>{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(29,158,117,0.2)', color: '#5DCAA5', border: '1px solid rgba(93,202,165,0.25)', letterSpacing: '0.07em' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5DCAA5', display: 'inline-block' }} />
                  Verified Mentor
                </span>
              </div>
            </div>
          </div>

          {/* ── VIEW MODE ── */}
          {!isEditing ? (
            <div className="p-6 grid gap-8 md:grid-cols-2">
              {/* Contact */}
              <div className="flex flex-col gap-5">
                <p style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5F5E5A', paddingBottom: '0.65rem', borderBottom: '0.5px solid #f0e8e4' }}>
                  Contact &amp; Basic Info
                </p>
                <Field label="Phone Number">
                  <p style={{ fontSize: '0.92rem', fontWeight: 500, color: user?.phone ? '#2C2C2A' : '#B4B2A9', fontStyle: user?.phone ? 'normal' : 'italic' }}>
                    {user?.phone || 'Not provided'}
                  </p>
                </Field>
                <Field label="Meeting Link">
                  {user?.mentorDetails?.meetingLink ? (
                    <a href={user.mentorDetails.meetingLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.88rem', color: '#1D9E75', fontWeight: 500, wordBreak: 'break-all' }}>
                      {user.mentorDetails.meetingLink}
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.88rem', color: '#B4B2A9', fontStyle: 'italic' }}>Not provided</p>
                  )}
                </Field>
                <Field label="LinkedIn Profile">
                  {user?.mentorDetails?.linkedinUrl ? (
                    <a href={user.mentorDetails.linkedinUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.88rem', color: '#1D9E75', fontWeight: 500, wordBreak: 'break-all' }}>
                      {user.mentorDetails.linkedinUrl}
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.88rem', color: '#B4B2A9', fontStyle: 'italic' }}>Not provided</p>
                  )}
                </Field>
              </div>

              {/* Mentorship */}
              <div className="flex flex-col gap-5">
                <p style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5F5E5A', paddingBottom: '0.65rem', borderBottom: '0.5px solid #f0e8e4' }}>
                  Mentorship Details
                </p>
                <Field label="Expertise / Focus Area">
                  <p style={{ fontSize: '0.92rem', fontWeight: 500, color: '#2C2C2A' }}>
                    {user?.mentorDetails?.expertise || 'General Support'}
                  </p>
                </Field>
                <Field label="Years of Experience">
                  <p style={{ fontSize: '0.92rem', fontWeight: 500, color: '#2C2C2A' }}>
                    {user?.mentorDetails?.experienceYears ? `${user.mentorDetails.experienceYears} Years` : 'Not specified'}
                  </p>
                </Field>
                <Field label="About Me (Bio)">
                  <p style={{ fontSize: '0.88rem', color: '#5F5E5A', fontWeight: 300, lineHeight: 1.7, background: '#fdf8f5', padding: '0.9rem 1rem', borderRadius: 13, border: '0.5px solid #e8ddd8' }}>
                    {user?.mentorDetails?.bio || 'No bio written yet.'}
                  </p>
                </Field>
              </div>
            </div>

          ) : (
            /* ── EDIT MODE ── */
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-8 md:grid-cols-2 mb-6">

                {/* Basic Info */}
                <div className="flex flex-col gap-4">
                  <p style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5F5E5A', paddingBottom: '0.65rem', borderBottom: '0.5px solid #f0e8e4' }}>
                    Basic Info
                  </p>

                  <Field label="Username">
                    <input name="username" type="text" required className="mp-inp" style={inputStyle}
                      value={formData.username} onChange={handleChange} />
                  </Field>

                  <Field label="Email Address (Cannot be changed)">
                    <input type="email" disabled className="mp-inp" style={{ ...inputStyle, background: '#f5efec', color: '#B4B2A9', cursor: 'not-allowed' }}
                      value={user?.email || ''} />
                  </Field>

                  <Field label="Phone Number">
                    <input name="phone" type="tel" className="mp-inp" style={inputStyle}
                      placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} />
                  </Field>

                  <Field label="Meeting Link">
                    <input name="meetingLink" type="text" className="mp-inp" style={inputStyle}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={formData.meetingLink} onChange={handleChange} />
                    <p style={{ fontSize: '0.72rem', color: '#888780', fontWeight: 300, marginTop: 4 }}>
                      Paste Google Meet or Zoom link. https:// is auto-added if missing.
                    </p>
                  </Field>

                  <Field label="LinkedIn URL">
                    <input name="linkedinUrl" type="text" className="mp-inp" style={inputStyle}
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl} onChange={handleChange} />
                  </Field>
                </div>

                {/* Mentorship Details */}
                <div className="flex flex-col gap-4">
                  <p style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5F5E5A', paddingBottom: '0.65rem', borderBottom: '0.5px solid #f0e8e4' }}>
                    Mentorship Details
                  </p>

                  <Field label="Primary Expertise">
                    <input name="expertise" type="text" className="mp-inp" style={inputStyle}
                      placeholder="e.g., Career Growth, STEM, Legal Rights…"
                      value={formData.expertise} onChange={handleChange} />
                  </Field>

                  <Field label="Years of Experience">
                    <input name="experienceYears" type="number" min="0" className="mp-inp" style={inputStyle}
                      placeholder="e.g., 5" value={formData.experienceYears} onChange={handleChange} />
                  </Field>

                  <Field label="About Me (Bio)">
                    <textarea name="bio" rows={6} required className="mp-ta"
                      style={{ ...inputStyle, resize: 'none', lineHeight: 1.65 }}
                      placeholder="Tell mentees about your journey and how you can help them…"
                      value={formData.bio} onChange={handleChange} />
                  </Field>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end pt-4" style={{ borderTop: '0.5px solid #f0e8e4' }}>
                <button type="button" onClick={cancelEdit}
                  style={{ padding: '0.65rem 1.3rem', borderRadius: 50, fontSize: '0.88rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: 'none', border: '0.5px solid #e8ddd8', color: '#5F5E5A' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '0.65rem 1.8rem', borderRadius: 50, fontSize: '0.88rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: '#1D9E75', color: 'white', border: 'none', opacity: saving ? 0.55 : 1 }}>
                  {saving ? 'Saving…' : 'Save Changes →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}