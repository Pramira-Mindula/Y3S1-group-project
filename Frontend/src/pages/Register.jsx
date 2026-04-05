import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E; --rose-light: #FBEAF0; --rose-mid: #ED93B1;
    --teal: #1D9E75; --teal-light: #E1F5EE; --teal-mid: #5DCAA5;
    --dark: #2C2C2A; --muted: #5F5E5A; --surface: #fdf8f5; --white: #ffffff;
  }

  .rg-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--surface);
    color: var(--dark);
  }

  /* ── LEFT PANEL ── */
  .rg-left {
    background: var(--dark);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 3rem; position: relative; overflow: hidden;
  }
  .rg-left::before {
    content: '';
    position: absolute; bottom: -100px; right: -60px;
    width: 420px; height: 420px;
    background: radial-gradient(ellipse, rgba(212,83,126,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .rg-left::after {
    content: '';
    position: absolute; top: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(ellipse, rgba(29,158,117,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .rg-left-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: white;
    text-decoration: none; position: relative; z-index: 1;
  }
  .rg-left-logo span { color: var(--rose-mid); font-style: italic; }

  .rg-left-content { position: relative; z-index: 1; }
  .rg-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 700; color: white;
    line-height: 1.22; margin-bottom: 1.2rem;
  }
  .rg-left-title em { color: var(--rose-mid); font-style: italic; }
  .rg-left-sub {
    font-size: 0.95rem; color: #B4B2A9;
    font-weight: 300; line-height: 1.75;
    max-width: 340px; margin-bottom: 2.5rem;
  }

  /* PERKS LIST */
  .rg-perks { display: flex; flex-direction: column; gap: 1rem; }
  .rg-perk {
    display: flex; align-items: flex-start; gap: 0.9rem;
  }
  .rg-perk-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .pi-rose { background: rgba(212,83,126,0.18); }
  .pi-teal { background: rgba(29,158,117,0.18); }
  .pi-amber { background: rgba(239,159,39,0.18); }
  .rg-perk-text { padding-top: 2px; }
  .rg-perk-title { font-size: 0.88rem; font-weight: 500; color: white; margin-bottom: 2px; }
  .rg-perk-sub { font-size: 0.76rem; color: #888780; font-weight: 300; line-height: 1.5; }

  .rg-left-footer {
    position: relative; z-index: 1;
    display: flex; gap: 1.5rem;
  }
  .rg-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: var(--rose-mid);
  }
  .rg-stat-lbl { font-size: 0.67rem; color: #888780; font-weight: 300; margin-top: 2px; }

  /* ── RIGHT PANEL ── */
  .rg-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem; overflow-y: auto;
  }
  .rg-form-wrap { width: 100%; max-width: 420px; }

  .rg-form-label {
    font-size: 0.72rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.6rem;
  }
  .rg-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--dark); margin-bottom: 0.35rem;
  }
  .rg-form-title em { color: var(--rose); font-style: italic; }
  .rg-form-sub {
    font-size: 0.88rem; color: var(--muted);
    font-weight: 300; margin-bottom: 2rem; line-height: 1.6;
  }

  /* ROLE TOGGLE */
  .rg-role-toggle {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.6rem; margin-bottom: 1.5rem;
  }
  .rg-role-btn {
    padding: 0.75rem 1rem; border-radius: 14px;
    border: 1.5px solid #e8ddd8; background: var(--white);
    font-size: 0.85rem; font-weight: 500; color: var(--muted);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.18s; text-align: center; display: flex;
    align-items: center; justify-content: center; gap: 7px;
  }
  .rg-role-btn:hover { border-color: var(--rose-mid); color: var(--rose); }
  .rg-role-btn.active {
    border-color: var(--rose); background: var(--rose-light);
    color: var(--rose);
  }
  .rg-role-btn.active-teal {
    border-color: var(--teal); background: var(--teal-light);
    color: var(--teal);
  }

  /* FIELDS */
  .rg-field { margin-bottom: 1.1rem; }
  .rg-field-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 0.45rem; display: block;
  }
  .rg-input {
    width: 100%; padding: 0.78rem 1rem;
    border: 0.5px solid #e8ddd8; border-radius: 13px;
    font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--white); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rg-input::placeholder { color: #B4B2A9; font-weight: 300; }
  .rg-input:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
  }
  .rg-textarea {
    width: 100%; padding: 0.78rem 1rem;
    border: 0.5px solid #e8ddd8; border-radius: 13px;
    font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--white); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: none; line-height: 1.6;
  }
  .rg-textarea::placeholder { color: #B4B2A9; font-weight: 300; }
  .rg-textarea:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
  }

  /* PASSWORD WRAPPER */
  .rg-pw-wrap { position: relative; }
  .rg-pw-toggle {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 15px; color: var(--muted); padding: 0; line-height: 1;
  }

  /* MENTOR SECTION */
  .rg-mentor-section {
    background: var(--teal-light); border: 0.5px solid rgba(29,158,117,0.2);
    border-radius: 16px; padding: 1.3rem 1.4rem; margin-bottom: 1.4rem;
  }
  .rg-mentor-section-title {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--teal); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 6px;
  }

  /* SUBMIT */
  .rg-submit {
    width: 100%; padding: 0.88rem;
    background: var(--rose); color: white; border: none;
    border-radius: 50px; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; margin-bottom: 1.5rem;
  }
  .rg-submit:hover { background: #993556; transform: translateY(-1px); }
  .rg-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* DIVIDER */
  .rg-divider {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 1.3rem;
  }
  .rg-divider-line { flex: 1; height: 0.5px; background: #e8ddd8; }
  .rg-divider-text { font-size: 0.73rem; color: var(--muted); font-weight: 300; }

  /* LOGIN LINK */
  .rg-login {
    text-align: center; font-size: 0.88rem; color: var(--muted); font-weight: 300;
  }
  .rg-login a { color: var(--rose); font-weight: 500; text-decoration: none; }
  .rg-login a:hover { color: #993556; }

  /* MOBILE */
  @media (max-width: 820px) {
    .rg-page { grid-template-columns: 1fr; }
    .rg-left { display: none; }
    .rg-right { padding: 3rem 1.5rem; }
  }
`;

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [expertise, setExpertise] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const registerData = { username, email, password, role, expertise, bio };
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/auth/register',
        registerData
      );
      toast.success(response.data?.message || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rg-page">

        {/* ── LEFT PANEL ── */}
        <div className="rg-left">
          <Link to="/" className="rg-left-logo">Empower<span>Her</span></Link>

          <div className="rg-left-content">
            <div className="rg-left-title">
              Start Your <em>Growth</em><br />Journey Today
            </div>
            <div className="rg-left-sub">
              Join thousands of women who have found mentors, resources,
              and a community that truly champions their growth and rights.
            </div>
            <div className="rg-perks">
              {[
                { icon: '🤝', cls: 'pi-rose', title: 'Verified Mentors', sub: 'Connect with 1,200+ expert women across industries worldwide.' },
                { icon: '📚', cls: 'pi-teal', title: 'Free Resource Library', sub: 'Legal guides, career tools, and wellness resources — all free.' },
                { icon: '🌐', cls: 'pi-amber', title: 'Global Community', sub: 'Join women from 62 countries who lift each other up every day.' },
              ].map(p => (
                <div className="rg-perk" key={p.title}>
                  <div className={`rg-perk-icon ${p.cls}`}>{p.icon}</div>
                  <div className="rg-perk-text">
                    <div className="rg-perk-title">{p.title}</div>
                    <div className="rg-perk-sub">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rg-left-footer">
            <div><div className="rg-stat-num">48K+</div><div className="rg-stat-lbl">Women</div></div>
            <div><div className="rg-stat-num">1,200</div><div className="rg-stat-lbl">Mentors</div></div>
            <div><div className="rg-stat-num">Free</div><div className="rg-stat-lbl">Always</div></div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rg-right">
          <div className="rg-form-wrap">
            <div className="rg-form-label">Get Started</div>
            <div className="rg-form-title">Create Your <em>Account</em></div>
            <div className="rg-form-sub">
              Join EmpowerHer free — no credit card required.
            </div>

            {/* Role Toggle */}
            <div className="rg-role-toggle">
              <button
                type="button"
                className={`rg-role-btn${role === 'user' ? ' active' : ''}`}
                onClick={() => setRole('user')}
              >
                🌱 I'm a Mentee
              </button>
              <button
                type="button"
                className={`rg-role-btn${role === 'mentor' ? ' active-teal' : ''}`}
                onClick={() => setRole('mentor')}
              >
                🤝 I'm a Mentor
              </button>
            </div>

            <form onSubmit={handleRegister}>

              {/* Username */}
              <div className="rg-field">
                <label className="rg-field-label">Username</label>
                <input
                  type="text"
                  required
                  className="rg-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="rg-field">
                <label className="rg-field-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="rg-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="rg-field">
                <label className="rg-field-label">Password</label>
                <div className="rg-pw-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="rg-input"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    className="rg-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Mentor-only fields */}
              {role === 'mentor' && (
                <div className="rg-mentor-section">
                  <div className="rg-mentor-section-title">
                    🤝 Mentor Profile Details
                  </div>
                  <div className="rg-field" style={{ marginBottom: '1rem' }}>
                    <label className="rg-field-label">Area of Expertise</label>
                    <input
                      type="text"
                      className="rg-input"
                      placeholder="e.g. Leadership, STEM, Legal Rights, Career Growth"
                      value={expertise}
                      onChange={e => setExpertise(e.target.value)}
                    />
                  </div>
                  <div className="rg-field" style={{ marginBottom: 0 }}>
                    <label className="rg-field-label">Your Bio</label>
                    <textarea
                      className="rg-textarea"
                      rows={3}
                      placeholder="Share a little about yourself and how you can help mentees…"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="rg-submit"
                disabled={submitting}
              >
                {submitting ? 'Creating your account…' : 'Create Account →'}
              </button>

              <div className="rg-divider">
                <div className="rg-divider-line" />
                <span className="rg-divider-text">Already have an account?</span>
                <div className="rg-divider-line" />
              </div>

              <div className="rg-login">
                <Link to="/login">Sign in instead →</Link>
              </div>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}