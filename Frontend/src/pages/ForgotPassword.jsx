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

  .fp-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--surface);
    color: var(--dark);
  }

  .fp-left {
    background: var(--dark);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 3rem; position: relative; overflow: hidden;
  }
  .fp-left::before {
    content: '';
    position: absolute; top: -100px; left: -60px;
    width: 420px; height: 420px;
    background: radial-gradient(ellipse, rgba(212,83,126,0.22) 0%, transparent 70%);
    pointer-events: none;
  }
  .fp-left::after {
    content: '';
    position: absolute; bottom: -80px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .fp-left-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: white;
    text-decoration: none; position: relative; z-index: 1;
  }
  .fp-left-logo span { color: var(--rose-mid); font-style: italic; }

  .fp-left-content { position: relative; z-index: 1; }
  .fp-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem; font-weight: 700; color: white;
    line-height: 1.2; margin-bottom: 1.2rem;
  }
  .fp-left-title em { color: var(--rose-mid); font-style: italic; }
  .fp-left-sub {
    font-size: 0.97rem; color: #B4B2A9;
    font-weight: 300; line-height: 1.75; max-width: 340px;
    margin-bottom: 2.5rem;
  }

  .fp-quote-card {
    background: rgba(255,255,255,0.06);
    border: 0.5px solid rgba(255,255,255,0.1);
    border-radius: 18px; padding: 1.5rem 1.8rem;
  }
  .fp-quote-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-style: italic; color: white;
    line-height: 1.65; margin-bottom: 1rem;
  }
  .fp-quote-author { display: flex; align-items: center; gap: 10px; }
  .fp-quote-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--rose-light); display: flex; align-items: center;
    justify-content: center; font-size: 13px; flex-shrink: 0;
  }
  .fp-quote-name { font-size: 0.8rem; font-weight: 500; color: #D3D1C7; }
  .fp-quote-role { font-size: 0.7rem; color: #888780; font-weight: 300; }

  .fp-left-footer {
    position: relative; z-index: 1;
    display: flex; gap: 1.5rem;
  }
  .fp-stat { text-align: center; }
  .fp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: var(--rose-mid);
  }
  .fp-stat-lbl { font-size: 0.68rem; color: #888780; font-weight: 300; margin-top: 2px; }

  .fp-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
  }

  .fp-form-wrap { width: 100%; max-width: 400px; }

  .fp-form-label {
    font-size: 0.72rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.6rem;
  }
  .fp-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--dark);
    margin-bottom: 0.35rem;
  }
  .fp-form-title em { color: var(--rose); font-style: italic; }
  .fp-form-sub {
    font-size: 0.88rem; color: var(--muted);
    font-weight: 300; margin-bottom: 2.2rem; line-height: 1.6;
  }

  .fp-field { margin-bottom: 1.2rem; }
  .fp-field-label {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 0.5rem; display: block;
  }
  .fp-input {
    width: 100%; padding: 0.8rem 1rem;
    border: 0.5px solid #e8ddd8; border-radius: 14px;
    font-size: 0.92rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--white); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .fp-input::placeholder { color: #B4B2A9; font-weight: 300; }
  .fp-input:focus {
    border-color: var(--rose-mid);
    box-shadow: 0 0 0 3px rgba(212,83,126,0.08);
    background: var(--white);
  }

  .fp-submit {
    width: 100%; padding: 0.9rem;
    background: var(--rose); color: white; border: none;
    border-radius: 50px; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; margin-bottom: 1.5rem;
  }
  .fp-submit:hover { background: #993556; transform: translateY(-1px); }
  .fp-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  .fp-back-link {
    text-align: center;
    font-size: 0.88rem; color: var(--muted); font-weight: 300;
  }
  .fp-back-link a {
    color: var(--rose); font-weight: 500; text-decoration: none; transition: color 0.2s;
  }
  .fp-back-link a:hover { color: #993556; }

  .fp-step-indicator {
    display: flex; gap: 0.5rem; margin-bottom: 2rem; justify-content: center;
  }
  .fp-step {
    width: 8px; height: 8px; border-radius: 50%;
    background: #e8ddd8; transition: background 0.2s;
  }
  .fp-step.active { background: var(--rose); }

  @media (max-width: 780px) {
    .fp-page { grid-template-columns: 1fr; }
    .fp-left { display: none; }
    .fp-right { padding: 3rem 1.5rem; }
  }
`;

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/auth/forgot-password',
        { email }
      );
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and move to password reset
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/auth/reset-password',
        { email, otp, newPassword }
      );
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reset password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fp-page">

        {/* ── LEFT PANEL ── */}
        <div className="fp-left">
          <Link to="/" className="fp-left-logo">Empower<span>Her</span></Link>

          <div className="fp-left-content">
            <div className="fp-left-title">
              Get Back to Your<br /><em>Journey</em>
            </div>
            <div className="fp-left-sub">
              Reset your password securely and regain access to your mentor network,
              resources, and community.
            </div>
            <div className="fp-quote-card">
              <div className="fp-quote-text">
                "Every setback is a setup for a comeback. We're here to help you get back on track."
              </div>
              <div className="fp-quote-author">
                <div className="fp-quote-dot">💪</div>
                <div>
                  <div className="fp-quote-name">EmpowerHer Team</div>
                  <div className="fp-quote-role">Supporting Your Growth</div>
                </div>
              </div>
            </div>
          </div>

          <div className="fp-left-footer">
            <div className="fp-stat">
              <div className="fp-stat-num">48K+</div>
              <div className="fp-stat-lbl">Women</div>
            </div>
            <div className="fp-stat">
              <div className="fp-stat-num">1,200</div>
              <div className="fp-stat-lbl">Mentors</div>
            </div>
            <div className="fp-stat">
              <div className="fp-stat-num">62</div>
              <div className="fp-stat-lbl">Countries</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="fp-right">
          <div className="fp-form-wrap">
            <div className="fp-form-label">Account Recovery</div>
            <div className="fp-form-title">Reset Your <em>Password</em></div>

            {/* Step Indicators */}
            <div className="fp-step-indicator">
              <div className={`fp-step ${step >= 1 ? 'active' : ''}`} />
              <div className={`fp-step ${step >= 2 ? 'active' : ''}`} />
              <div className={`fp-step ${step >= 3 ? 'active' : ''}`} />
            </div>

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                <div className="fp-form-sub">
                  Enter your email address and we'll send you an OTP to reset your password.
                </div>
                <form onSubmit={handleRequestOTP}>
                  <div className="fp-field">
                    <label className="fp-field-label">Email Address</label>
                    <input
                      type="email"
                      required
                      className="fp-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="fp-submit"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send OTP →'}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <>
                <div className="fp-form-sub">
                  Enter the 6-digit OTP sent to <strong>{email}</strong>
                </div>
                <form onSubmit={handleVerifyOTP}>
                  <div className="fp-field">
                    <label className="fp-field-label">One-Time Password</label>
                    <input
                      type="text"
                      maxLength="6"
                      required
                      className="fp-input"
                      placeholder="000000"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <button
                    type="submit"
                    className="fp-submit"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP →'}
                  </button>
                  <div className="fp-back-link">
                    <a href="#" onClick={(e) => { e.preventDefault(); setStep(1); setOtp(''); }}>
                      ← Back to Email
                    </a>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <>
                <div className="fp-form-sub">
                  Create a strong new password for your account.
                </div>
                <form onSubmit={handleResetPassword}>
                  <div className="fp-field">
                    <label className="fp-field-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="fp-input"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: 'var(--muted)',
                          padding: 0,
                          lineHeight: 1
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field-label">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="fp-input"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: 'var(--muted)',
                          padding: 0,
                          lineHeight: 1
                        }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="fp-submit"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password →'}
                  </button>
                </form>
              </>
            )}

            <div className="fp-back-link">
              <Link to="/login">← Back to Sign In</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ForgotPassword;
