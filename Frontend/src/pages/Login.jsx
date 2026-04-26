import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E; --rose-light: #FBEAF0; --rose-mid: #ED93B1;
    --teal: #1D9E75; --teal-light: #E1F5EE; --teal-mid: #5DCAA5;
    --dark: #2C2C2A; --muted: #5F5E5A; --surface: #fdf8f5; --white: #ffffff;
  }

  .lg-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--surface);
    color: var(--dark);
  }

  /* ── LEFT PANEL ── */
  .lg-left {
    background: var(--dark);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 3rem; position: relative; overflow: hidden;
  }
  .lg-left::before {
    content: '';
    position: absolute; top: -100px; left: -60px;
    width: 420px; height: 420px;
    background: radial-gradient(ellipse, rgba(212,83,126,0.22) 0%, transparent 70%);
    pointer-events: none;
  }
  .lg-left::after {
    content: '';
    position: absolute; bottom: -80px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .lg-left-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: white;
    text-decoration: none; position: relative; z-index: 1;
  }
  .lg-left-logo span { color: var(--rose-mid); font-style: italic; }

  .lg-left-content { position: relative; z-index: 1; }
  .lg-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem; font-weight: 700; color: white;
    line-height: 1.2; margin-bottom: 1.2rem;
  }
  .lg-left-title em { color: var(--rose-mid); font-style: italic; }
  .lg-left-sub {
    font-size: 0.97rem; color: #B4B2A9;
    font-weight: 300; line-height: 1.75; max-width: 340px;
    margin-bottom: 2.5rem;
  }

  /* QUOTE CARD */
  .lg-quote-card {
    background: rgba(255,255,255,0.06);
    border: 0.5px solid rgba(255,255,255,0.1);
    border-radius: 18px; padding: 1.5rem 1.8rem;
  }
  .lg-quote-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-style: italic; color: white;
    line-height: 1.65; margin-bottom: 1rem;
  }
  .lg-quote-author { display: flex; align-items: center; gap: 10px; }
  .lg-quote-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--rose-light); display: flex; align-items: center;
    justify-content: center; font-size: 13px; flex-shrink: 0;
  }
  .lg-quote-name { font-size: 0.8rem; font-weight: 500; color: #D3D1C7; }
  .lg-quote-role { font-size: 0.7rem; color: #888780; font-weight: 300; }

  .lg-left-footer {
    position: relative; z-index: 1;
    display: flex; gap: 1.5rem;
  }
  .lg-stat { text-align: center; }
  .lg-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: var(--rose-mid);
  }
  .lg-stat-lbl { font-size: 0.68rem; color: #888780; font-weight: 300; margin-top: 2px; }

  /* ── RIGHT PANEL ── */
  .lg-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
  }
  .lg-form-wrap { width: 100%; max-width: 400px; }

  .lg-form-label {
    font-size: 0.72rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.6rem;
  }
  .lg-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--dark);
    margin-bottom: 0.35rem;
  }
  .lg-form-title em { color: var(--rose); font-style: italic; }
  .lg-form-sub {
    font-size: 0.88rem; color: var(--muted);
    font-weight: 300; margin-bottom: 2.2rem; line-height: 1.6;
  }

  /* FIELDS */
  .lg-field { margin-bottom: 1.2rem; }
  .lg-field-label {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 0.5rem; display: block;
  }
  .lg-input {
    width: 100%; padding: 0.8rem 1rem;
    border: 0.5px solid #e8ddd8; border-radius: 14px;
    font-size: 0.92rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--white); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lg-input::placeholder { color: #B4B2A9; font-weight: 300; }
  .lg-input:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
    background: var(--white);
  }

  /* PASSWORD WRAPPER */
  .lg-pw-wrap { position: relative; }
  .lg-pw-toggle {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 16px; color: var(--muted); padding: 0; line-height: 1;
  }

  /* FORGOT */
  .lg-forgot {
    text-align: right; margin-top: 0.4rem; margin-bottom: 1.8rem;
  }
  .lg-forgot a {
    font-size: 0.8rem; color: var(--rose); font-weight: 500;
    text-decoration: none; transition: color 0.2s;
  }
  .lg-forgot a:hover { color: #993556; }

  /* SUBMIT */
  .lg-submit {
    width: 100%; padding: 0.9rem;
    background: var(--rose); color: white; border: none;
    border-radius: 50px; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; margin-bottom: 1.5rem;
  }
  .lg-submit:hover { background: #993556; transform: translateY(-1px); }
  .lg-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* DIVIDER */
  .lg-divider {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .lg-divider-line { flex: 1; height: 0.5px; background: #e8ddd8; }
  .lg-divider-text { font-size: 0.75rem; color: var(--muted); font-weight: 300; }

  /* REGISTER LINK */
  .lg-register {
    text-align: center;
    font-size: 0.88rem; color: var(--muted); font-weight: 300;
  }
  .lg-register a {
    color: var(--rose); font-weight: 500; text-decoration: none; transition: color 0.2s;
  }
  .lg-register a:hover { color: #993556; }

  /* MOBILE */
  @media (max-width: 780px) {
    .lg-page { grid-template-columns: 1fr; }
    .lg-left { display: none; }
    .lg-right { padding: 3rem 1.5rem; }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const loginData = { email, password };

    axios.post(import.meta.env.VITE_API_URL + '/auth/login', loginData)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        // Save user object so other pages (e.g. Community) can read the current user's ID
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Welcome back!');
        const role = response.data.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'mentor') navigate('/mentor');
        else navigate('/');
      })
      .catch(error => {
        const msg = error.response?.data?.message || 'Cannot connect to server. Check backend and API URL.';
        toast.error(msg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lg-page">

        {/* ── LEFT PANEL ── */}
        <div className="lg-left">
          <Link to="/" className="lg-left-logo">Empower<span>Her</span></Link>

          <div className="lg-left-content">
            <div className="lg-left-title">
              Your Journey<br />Continues <em>Here</em>
            </div>
            <div className="lg-left-sub">
              Sign in to reconnect with your mentor, access your resources,
              and continue growing on your own terms.
            </div>
            <div className="lg-quote-card">
              <div className="lg-quote-text">
                "The moment I found my mentor on EmpowerHer, everything changed.
                I finally had someone who believed in me before I believed in myself."
              </div>
              <div className="lg-quote-author">
                <div className="lg-quote-dot">🌱</div>
                <div>
                  <div className="lg-quote-name">Naledi K.</div>
                  <div className="lg-quote-role">Software Engineer · South Africa</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg-left-footer">
            <div className="lg-stat">
              <div className="lg-stat-num">48K+</div>
              <div className="lg-stat-lbl">Women</div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-num">1,200</div>
              <div className="lg-stat-lbl">Mentors</div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-num">62</div>
              <div className="lg-stat-lbl">Countries</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lg-right">
          <div className="lg-form-wrap">
            <div className="lg-form-label">Welcome Back</div>
            <div className="lg-form-title">Sign in to <em>EmpowerHer</em></div>
            <div className="lg-form-sub">
              Enter your credentials to access your account and continue your journey.
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="lg-field">
                <label className="lg-field-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="lg-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="lg-field">
                <label className="lg-field-label">Password</label>
                <div className="lg-pw-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="lg-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    className="lg-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="lg-forgot">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="lg-submit"
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Sign In →'}
              </button>

              <div className="lg-divider">
                <div className="lg-divider-line" />
                <span className="lg-divider-text">New to EmpowerHer?</span>
                <div className="lg-divider-line" />
              </div>

              <div className="lg-register">
                Don't have an account?{' '}
                <Link to="/register">Create one free →</Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;