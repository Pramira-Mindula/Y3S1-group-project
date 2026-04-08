import React from 'react';
import { Link } from 'react-router-dom';
import NewsSection from '../components/NewsSection';

// Add this to your global CSS or index.css:
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

const styles = `
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

  .eh-body {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    color: var(--dark);
    overflow-x: hidden;
  }

  /* HERO */
  .eh-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 88vh;
    align-items: center;
    padding: 4rem 3rem;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .eh-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--teal-light);
    color: #0F6E56;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    margin-bottom: 1.8rem;
    letter-spacing: 0.05em;
  }
  .eh-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--teal);
    flex-shrink: 0;
  }
  .eh-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.4rem;
    line-height: 1.18;
    font-weight: 700;
    margin-bottom: 1.2rem;
    color: var(--dark);
  }
  .eh-hero h1 em {
    color: var(--rose);
    font-style: italic;
  }
  .eh-hero p {
    font-size: 1.05rem;
    color: var(--muted);
    line-height: 1.75;
    margin-bottom: 2.2rem;
    font-weight: 300;
    max-width: 460px;
  }
  .eh-hero-btns {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .eh-btn-primary {
    background: var(--rose);
    color: white;
    border: none;
    padding: 0.85rem 2rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .eh-btn-primary:hover {
    background: #993556;
    transform: translateY(-1px);
  }
  .eh-btn-outline {
    background: transparent;
    color: var(--dark);
    border: 1.5px solid #c5b8b0;
    padding: 0.85rem 2rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .eh-btn-outline:hover {
    border-color: var(--rose);
    color: var(--rose);
  }
  .eh-hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 0;
  }
  .eh-hero-img-wrap {
    position: relative;
    width: 360px;
    height: 460px;
  }
  .eh-hero-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
    display: block;
  }
  .eh-float-card {
    position: absolute;
    background: white;
    border-radius: 16px;
    border: 0.5px solid #e8ddd8;
    padding: 0.9rem 1.1rem;
    box-shadow: 0 8px 32px rgba(212,83,126,0.1);
  }
  .eh-float-card.top-left {
    top: 30px;
    left: -30px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .eh-float-card.bottom-right {
    bottom: 40px;
    right: -20px;
    text-align: center;
    min-width: 130px;
  }
  .eh-float-stat {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--rose);
  }
  .eh-float-label {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 400;
    margin-top: 2px;
  }
  .eh-float-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--teal-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .eh-float-text-main {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--dark);
  }
  .eh-float-text-sub {
    font-size: 0.72rem;
    color: var(--muted);
  }

  /* STATS STRIP */
  .eh-stats-strip {
    background: var(--dark);
    padding: 2rem 3rem;
    display: flex;
    justify-content: center;
    gap: 5rem;
    flex-wrap: wrap;
  }
  .eh-stat-item { text-align: center; }
  .eh-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--rose-mid);
  }
  .eh-stat-desc {
    font-size: 0.8rem;
    color: #B4B2A9;
    margin-top: 4px;
    font-weight: 300;
  }

  /* SECTIONS */
  .eh-section {
    padding: 5rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .eh-section-label {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: var(--teal);
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }
  .eh-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
    line-height: 1.25;
  }
  .eh-section-sub {
    font-size: 1rem;
    color: var(--muted);
    max-width: 540px;
    line-height: 1.7;
    font-weight: 300;
  }
  .eh-section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* FEATURES */
  .eh-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .eh-feature-card {
    background: var(--white);
    border-radius: 20px;
    border: 0.5px solid #e8ddd8;
    padding: 1.8rem;
    transition: all 0.25s;
  }
  .eh-feature-card:hover {
    border-color: var(--rose-mid);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(212,83,126,0.08);
  }
  .eh-feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 1.2rem;
  }
  .fi-rose { background: var(--rose-light); }
  .fi-teal { background: var(--teal-light); }
  .eh-feature-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
    color: var(--dark);
  }
  .eh-feature-card p {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.65;
    font-weight: 300;
  }

  /* MENTORS */
  .eh-mentors-section {
    background: var(--rose-light);
    padding: 5rem 3rem;
  }
  .eh-mentors-inner { max-width: 1200px; margin: 0 auto; }
  .eh-mentors-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .eh-mentor-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .eh-mentor-card {
    background: white;
    border-radius: 20px;
    border: 0.5px solid #e8ddd8;
    overflow: hidden;
  }
  .eh-mentor-img { height: 200px; overflow: hidden; }
  .eh-mentor-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .m1 { background: linear-gradient(135deg, #F4C0D1, #ED93B1); }
  .m2 { background: linear-gradient(135deg, #9FE1CB, #5DCAA5); }
  .m3 { background: linear-gradient(135deg, #FAC775, #EF9F27); }
  .eh-mentor-info { padding: 1.2rem 1.4rem; }
  .eh-mentor-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--dark);
  }
  .eh-mentor-role {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 3px 0 10px;
    font-weight: 300;
  }
  .eh-mentor-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .eh-tag {
    background: var(--rose-light);
    color: #993556;
    font-size: 0.7rem;
    padding: 3px 10px;
    border-radius: 50px;
    font-weight: 500;
  }
  .eh-tag.teal { background: var(--teal-light); color: #0F6E56; }
  .eh-tag.amber { background: #FAEEDA; color: #854F0B; }

  /* RESOURCES */
  .eh-res-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
    margin-top: 2.5rem;
  }
  .eh-res-card {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    background: white;
    border: 0.5px solid #e8ddd8;
    border-radius: 16px;
    padding: 1.4rem;
    transition: all 0.2s;
  }
  .eh-res-card:hover {
    border-color: var(--teal-mid);
    box-shadow: 0 8px 24px rgba(29,158,117,0.08);
  }
  .eh-res-num {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    min-width: 48px;
  }
  .eh-res-content h4 {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 4px;
  }
  .eh-res-content p {
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.5;
  }

  /* NEWS */
  .eh-news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-top: 2.5rem;
  }
  .eh-news-card {
    background: white;
    border: 0.5px solid #e8ddd8;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
    display: block;
  }
  .eh-news-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(29,158,117,0.08);
    border-color: var(--teal-mid);
  }
  .eh-news-image {
    width: 100%;
    height: 170px;
    object-fit: cover;
    display: block;
    background: #f5f5f5;
  }
  .eh-news-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 0.85rem;
  }
  .eh-news-content {
    padding: 1rem;
  }
  .eh-news-content h4 {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.45rem;
    color: var(--dark);
    line-height: 1.4;
  }
  .eh-news-content p {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.55;
    font-weight: 300;
  }

  /* CTA */
  .eh-cta-section {
    background: var(--dark);
    padding: 5rem 3rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .eh-cta-section::before {
    content: '';
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(212,83,126,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .eh-cta-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    color: white;
    margin-bottom: 1rem;
    position: relative;
  }
  .eh-cta-section h2 em { color: var(--rose-mid); font-style: italic; }
  .eh-cta-section p {
    color: #B4B2A9;
    font-size: 1rem;
    margin-bottom: 2.5rem;
    font-weight: 300;
    position: relative;
  }
  .eh-cta-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    position: relative;
    flex-wrap: wrap;
  }
  .eh-btn-white {
    background: white;
    color: var(--dark);
    border: none;
    padding: 0.9rem 2.2rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .eh-btn-white:hover { background: #f0e8e3; transform: translateY(-1px); }
  .eh-btn-ghost {
    background: transparent;
    color: white;
    border: 1.5px solid rgba(255,255,255,0.3);
    padding: 0.9rem 2.2rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .eh-btn-ghost:hover { border-color: white; }

  .eh-divider { border: none; border-top: 0.5px solid #e8ddd8; margin: 0; }

  @media (max-width: 900px) {
    .eh-hero { grid-template-columns: 1fr; text-align: center; min-height: auto; padding: 3rem 1.5rem; }
    .eh-hero p { max-width: 100%; }
    .eh-hero-btns { justify-content: center; }
    .eh-hero-visual { display: none; }
    .eh-features-grid { grid-template-columns: 1fr 1fr; }
    .eh-mentor-cards { grid-template-columns: 1fr; }
    .eh-res-grid { grid-template-columns: 1fr; }
    .eh-news-grid { grid-template-columns: 1fr 1fr; }
    .eh-stats-strip { gap: 2rem; padding: 2rem 1.5rem; }
    .eh-section { padding: 3rem 1.5rem; }
    .eh-mentors-section { padding: 3rem 1.5rem; }
    .eh-cta-section { padding: 3rem 1.5rem; }
    .eh-cta-section h2 { font-size: 2rem; }
  }

  @media (max-width: 600px) {
    .eh-features-grid { grid-template-columns: 1fr; }
    .eh-hero h1 { font-size: 2.4rem; }
    .eh-section-title { font-size: 1.8rem; }
    .eh-news-grid { grid-template-columns: 1fr; }
  }
`;

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <main className="eh-body">

        {/* ── HERO ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
          <div className="eh-hero">
            <div className="eh-hero-text">
              <div className="eh-hero-badge">
                <div className="eh-badge-dot" />
                Supporting Women Since 2019
              </div>
              <h1>
                Rise Together,<br />
                <em>Lead the Change</em><br />
                You Deserve
              </h1>
              <p>
                A global network connecting women with mentors, resources, and a
                community that champions equal rights, career growth, and personal
                development.
              </p>
              <div className="eh-hero-btns">
                <Link to="/mentors" className="eh-btn-primary">Find a Mentor</Link>
                <Link to="/register" className="eh-btn-outline">Become a Mentor</Link>
              </div>
            </div>

            <div className="eh-hero-visual">
              <div className="eh-hero-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
                  alt="Empowered woman"
                />
                <div className="eh-float-card top-left">
                  <div className="eh-float-icon">🌱</div>
                  <div>
                    <div className="eh-float-text-main">Growth Programs</div>
                    <div className="eh-float-text-sub">12 new this week</div>
                  </div>
                </div>
                <div className="eh-float-card bottom-right">
                  <div className="eh-float-stat">4.9★</div>
                  <div className="eh-float-label">Mentor Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="eh-stats-strip">
          {[
            { num: '48K+', desc: 'Women Empowered' },
            { num: '1,200', desc: 'Expert Mentors' },
            { num: '94%', desc: 'Career Growth Rate' },
            { num: '62', desc: 'Countries Reached' },
          ].map((s) => (
            <div className="eh-stat-item" key={s.desc}>
              <div className="eh-stat-num">{s.num}</div>
              <div className="eh-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <div className="eh-section">
          <div className="eh-section-label">What we offer</div>
          <div className="eh-section-header">
            <div className="eh-section-title">
              Everything You Need to<br />Thrive &amp; Lead
            </div>
            <div className="eh-section-sub">
              From one-on-one mentorship to global advocacy tools — we support
              every step of your journey.
            </div>
          </div>
          <div className="eh-features-grid">
            {[
              { icon: '🤝', color: 'fi-rose', title: '1-on-1 Mentorship', desc: 'Connect with verified women leaders across industries for personalized guidance tailored to your goals.' },
              { icon: '📚', color: 'fi-teal', title: 'Resource Library', desc: 'Access hundreds of curated articles, toolkits, legal guides, and courses on women\'s rights and self-development.' },
              { icon: '🌐', color: 'fi-rose', title: 'Global Network', desc: 'Join community circles, discussion forums, and local chapters across 62 countries — your tribe awaits.' },
              { icon: '🎯', color: 'fi-teal', title: 'Career Coaching', desc: 'Resume workshops, interview prep, salary negotiation tools, and leadership tracks to accelerate your career.' },
              { icon: '⚖️', color: 'fi-rose', title: 'Rights & Advocacy', desc: 'Know your rights. Access legal support, advocacy campaigns, and policy change resources at your fingertips.' },
              { icon: '💬', color: 'fi-teal', title: 'Safe Spaces', desc: 'Moderated support groups and mental wellness sessions designed to nurture, heal, and inspire confidence.' },
            ].map((f) => (
              <div className="eh-feature-card" key={f.title}>
                <div className={`eh-feature-icon ${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="eh-divider" />

         {/* ── NEWS API SECTION ── */}
        <NewsSection />

        {/* ── RESOURCES ── */}
        <div className="eh-section">
          <div className="eh-section-label">Resources</div>
          <div className="eh-section-header">
            <div className="eh-section-title">
              Knowledge is Power.<br />Access Yours Today.
            </div>
            <div className="eh-section-sub">
              Free tools, guides, and frameworks built by experts for real-world impact.
            </div>
          </div>
          <div className="eh-res-grid">
            {[
              { num: '01', color: '#F4C0D1', title: "Women's Rights Toolkit", desc: "Legal guides covering workplace discrimination, equal pay laws, and reproductive rights across 40+ countries." },
              { num: '02', color: '#9FE1CB', title: 'Career Growth Playbook', desc: 'Step-by-step frameworks for negotiating raises, breaking into leadership, and building your personal brand.' },
              { num: '03', color: '#F4C0D1', title: 'Mental Wellness Hub', desc: 'Guided practices, community support circles, and professional referrals to help you thrive holistically.' },
              { num: '04', color: '#9FE1CB', title: 'Entrepreneurship Starter Kit', desc: 'From business plan templates to funding databases — everything a woman-led startup needs to launch confidently.' },
            ].map((r) => (
              <div className="eh-res-card" key={r.num}>
                <div className="eh-res-num" style={{ color: r.color }}>{r.num}</div>
                <div className="eh-res-content">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

       

        {/* ── CTA ── */}
        <div className="eh-cta-section">
          <h2>Your Story Deserves<br />to be <em>Heard &amp; Celebrated</em></h2>
          <p>Join 48,000+ women who are rewriting the rules — one breakthrough at a time.</p>
          <div className="eh-cta-btns">
            <Link to="/register" className="eh-btn-white">Start Your Journey →</Link>
            <Link to="/stories" className="eh-btn-ghost">Read Success Stories</Link>
          </div>
        </div>

      </main>
    </>
  );
}