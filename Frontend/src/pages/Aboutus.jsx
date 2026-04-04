import React from 'react';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E; --rose-light: #FBEAF0; --rose-mid: #ED93B1;
    --teal: #1D9E75; --teal-light: #E1F5EE; --teal-mid: #5DCAA5;
    --dark: #2C2C2A; --muted: #5F5E5A; --surface: #fdf8f5; --white: #ffffff;
  }

  .au-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    color: var(--dark);
  }

  /* ── HERO BANNER ── */
  .au-hero {
    background: var(--dark);
    padding: 5rem 3rem 6rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .au-hero::before {
    content: '';
    position: absolute; top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(212,83,126,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .au-hero-deco1 {
    position: absolute; bottom: -40px; right: -40px;
    width: 220px; height: 220px; border-radius: 50%;
    border: 50px solid rgba(237,147,177,0.06); pointer-events: none;
  }
  .au-hero-deco2 {
    position: absolute; top: -30px; left: -30px;
    width: 160px; height: 160px; border-radius: 50%;
    border: 35px solid rgba(93,202,165,0.06); pointer-events: none;
  }
  .au-hero-label {
    font-size: 0.75rem; letter-spacing: 0.12em; color: var(--teal-mid);
    font-weight: 500; text-transform: uppercase; margin-bottom: 1rem;
    position: relative;
  }
  .au-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem; font-weight: 700; color: white;
    line-height: 1.18; margin-bottom: 1.2rem; position: relative;
  }
  .au-hero-title em { color: var(--rose-mid); font-style: italic; }
  .au-hero-sub {
    font-size: 1.05rem; color: #B4B2A9; font-weight: 300;
    max-width: 540px; margin: 0 auto; line-height: 1.75; position: relative;
  }

  /* ── MAIN CONTENT ── */
  .au-main { max-width: 1100px; margin: 0 auto; padding: 5rem 3rem; }

  /* MISSION SECTION */
  .au-mission {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 5rem; align-items: center; margin-bottom: 6rem;
  }
  .au-section-label {
    font-size: 0.72rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.8rem;
  }
  .au-section-title {
    font-family: 'Playfair Display', serif; font-size: 2.2rem;
    font-weight: 700; color: var(--dark); line-height: 1.25; margin-bottom: 1.2rem;
  }
  .au-section-title em { color: var(--rose); font-style: italic; }
  .au-body-text {
    font-size: 0.97rem; color: var(--muted); line-height: 1.8;
    font-weight: 300; margin-bottom: 1.2rem;
  }
  .au-body-text:last-of-type { margin-bottom: 0; }

  /* VISUAL BLOCK */
  .au-visual-block {
    position: relative; display: flex;
    justify-content: center; align-items: center;
  }
  .au-visual-main {
    width: 100%; aspect-ratio: 4/5;
    border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%;
    background: linear-gradient(135deg, var(--rose-light) 0%, var(--rose-mid) 60%, var(--rose) 100%);
    overflow: hidden; position: relative;
  }
  .au-visual-main img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%;
    display: block;
  }
  .au-float-pill {
    position: absolute; background: white;
    border: 0.5px solid #e8ddd8; border-radius: 14px;
    padding: 0.75rem 1.1rem; box-shadow: 0 6px 24px rgba(212,83,126,0.1);
  }
  .au-float-pill.top { top: 20px; right: -20px; display: flex; align-items: center; gap: 8px; }
  .au-float-pill.bottom { bottom: 24px; left: -20px; text-align: center; min-width: 110px; }
  .au-pill-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--teal-light); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .au-pill-main { font-size: 0.83rem; font-weight: 500; color: var(--dark); }
  .au-pill-sub { font-size: 0.68rem; color: var(--muted); }
  .au-pill-num { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700; color: var(--rose); }
  .au-pill-lbl { font-size: 0.68rem; color: var(--muted); margin-top: 2px; }

  /* VALUES SECTION */
  .au-values { margin-bottom: 6rem; }
  .au-values-header { text-align: center; margin-bottom: 3rem; }
  .au-values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .au-value-card {
    background: var(--white); border-radius: 20px; border: 0.5px solid #e8ddd8;
    padding: 2rem 1.8rem; transition: all 0.25s;
  }
  .au-value-card:hover {
    border-color: var(--rose-mid); transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(212,83,126,0.08);
  }
  .au-value-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 1.2rem;
  }
  .vi-rose { background: var(--rose-light); }
  .vi-teal { background: var(--teal-light); }
  .vi-amber { background: #FAEEDA; }
  .au-value-title {
    font-family: 'Playfair Display', serif; font-size: 1.1rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.6rem;
  }
  .au-value-desc {
    font-size: 0.87rem; color: var(--muted); line-height: 1.65; font-weight: 300;
  }

  /* STATS STRIP */
  .au-stats-strip {
    background: var(--dark); border-radius: 22px;
    padding: 2.5rem 3rem; display: flex;
    justify-content: space-around; flex-wrap: wrap; gap: 2rem;
    margin-bottom: 6rem;
  }
  .au-stat { text-align: center; }
  .au-stat-num {
    font-family: 'Playfair Display', serif; font-size: 2.4rem;
    font-weight: 700; color: var(--rose-mid); line-height: 1;
  }
  .au-stat-desc { font-size: 0.78rem; color: #B4B2A9; margin-top: 6px; font-weight: 300; }

  /* TEAM SECTION */
  .au-team { margin-bottom: 6rem; }
  .au-team-header { text-align: center; margin-bottom: 3rem; }
  .au-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .au-team-card {
    background: var(--white); border-radius: 20px;
    border: 0.5px solid #e8ddd8; overflow: hidden; transition: all 0.25s;
  }
  .au-team-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(44,44,42,0.07); }
  .au-team-banner { height: 130px; display: flex; align-items: flex-end; padding: 0 1.4rem 0; }
  .tb1 { background: linear-gradient(135deg,#FBEAF0,#F4C0D1); }
  .tb2 { background: linear-gradient(135deg,#E1F5EE,#9FE1CB); }
  .tb3 { background: linear-gradient(135deg,#FAEEDA,#FAC775); }
  .au-team-avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(255,255,255,0.75); border: 2px solid rgba(255,255,255,0.9);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 1.4rem;
    font-weight: 700; color: var(--dark); transform: translateY(28px); flex-shrink: 0;
  }
  .au-team-info { padding: 2.2rem 1.4rem 1.5rem; }
  .au-team-name {
    font-family: 'Playfair Display', serif; font-size: 1.05rem;
    font-weight: 700; color: var(--dark); margin-bottom: 3px;
  }
  .au-team-role { font-size: 0.78rem; color: var(--muted); font-weight: 300; margin-bottom: 0.8rem; }
  .au-team-tag {
    display: inline-block; font-size: 0.68rem; font-weight: 500;
    padding: 0.22rem 0.75rem; border-radius: 50px;
    background: var(--rose-light); color: #993556;
  }
  .au-team-tag.teal { background: var(--teal-light); color: #0F6E56; }
  .au-team-tag.amber { background: #FAEEDA; color: #854F0B; }

  /* CTA SECTION */
  .au-cta {
    background: var(--rose-light); border-radius: 22px;
    padding: 4rem 3rem; text-align: center;
    border: 0.5px solid var(--rose-mid);
  }
  .au-cta-title {
    font-family: 'Playfair Display', serif; font-size: 2.2rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.8rem; line-height: 1.25;
  }
  .au-cta-title em { color: var(--rose); font-style: italic; }
  .au-cta-sub {
    font-size: 0.97rem; color: var(--muted); font-weight: 300;
    margin-bottom: 2rem; line-height: 1.7;
  }
  .au-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .au-btn-primary {
    font-size: 0.9rem; font-weight: 500; color: white;
    background: var(--rose); text-decoration: none;
    padding: 0.8rem 2rem; border-radius: 50px; transition: all 0.2s;
    display: inline-block; border: none; cursor: pointer; font-family: 'DM Sans',sans-serif;
  }
  .au-btn-primary:hover { background: #993556; transform: translateY(-1px); }
  .au-btn-outline {
    font-size: 0.9rem; font-weight: 500; color: var(--dark);
    background: transparent; text-decoration: none;
    padding: 0.8rem 2rem; border-radius: 50px; transition: all 0.2s;
    display: inline-block; border: 1.5px solid #c5b8b0;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
  }
  .au-btn-outline:hover { border-color: var(--rose); color: var(--rose); }

  .au-divider { border: none; border-top: 0.5px solid #e8ddd8; margin: 0; }

  @media (max-width: 900px) {
    .au-mission { grid-template-columns: 1fr; gap: 3rem; }
    .au-values-grid { grid-template-columns: 1fr 1fr; }
    .au-team-grid { grid-template-columns: 1fr 1fr; }
    .au-hero-title { font-size: 2.4rem; }
    .au-main { padding: 3rem 1.5rem; }
  }
  @media (max-width: 580px) {
    .au-values-grid { grid-template-columns: 1fr; }
    .au-team-grid { grid-template-columns: 1fr; }
    .au-hero { padding: 3.5rem 1.5rem 4.5rem; }
    .au-hero-title { font-size: 2rem; }
    .au-section-title { font-size: 1.8rem; }
    .au-stats-strip { padding: 2rem 1.5rem; }
    .au-cta { padding: 2.5rem 1.5rem; }
  }
`;

export default function AboutUs() {
  return (
    <>
      <style>{styles}</style>
      <div className="au-page">

        {/* ── HERO ── */}
        <div className="au-hero">
          <div className="au-hero-deco1" />
          <div className="au-hero-deco2" />
          <div className="au-hero-label">Our Story</div>
          <div className="au-hero-title">
            Empowering Women,<br /><em>One Connection</em> at a Time
          </div>
          <div className="au-hero-sub">
            EmpowerHer was built on a simple belief — that every woman deserves access to
            a mentor, a community, and the tools to lead her own story.
          </div>
        </div>

        <div className="au-main">

          {/* ── MISSION ── */}
          <div className="au-mission">
            <div>
              <div className="au-section-label">Our Mission</div>
              <div className="au-section-title">
                Connecting Ambition<br />with <em>Experience</em>
              </div>
              <p className="au-body-text">
                EmpowerHer is a platform dedicated to connecting ambitious women with experienced
                mentors across industries, borders, and backgrounds. Our mission is to foster
                personal and professional growth by providing a supportive network where knowledge
                and lived experience can be shared freely.
              </p>
              <p className="au-body-text">
                We believe mentorship is one of the most powerful tools for unlocking potential.
                Whether you're navigating a career pivot, advocating for your rights, or simply
                seeking a guide who's walked a similar path — EmpowerHer exists to help you
                find her.
              </p>
              <p className="au-body-text">
                Our platform brings together personalized mentor matching, a comprehensive
                resource library, and a global community committed to gender equality and
                women's self-development.
              </p>
            </div>
            <div className="au-visual-block">
              <div className="au-visual-main">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
                  alt="Empowered women"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="au-float-pill top">
                <div className="au-pill-icon">🌱</div>
                <div>
                  <div className="au-pill-main">Growing Together</div>
                  <div className="au-pill-sub">48K+ women strong</div>
                </div>
              </div>
              <div className="au-float-pill bottom">
                <div className="au-pill-num">62</div>
                <div className="au-pill-lbl">Countries</div>
              </div>
            </div>
          </div>

          {/* ── VALUES ── */}
          <div className="au-values">
            <div className="au-values-header">
              <div className="au-section-label" style={{ textAlign: 'center' }}>What We Stand For</div>
              <div className="au-section-title" style={{ textAlign: 'center', marginBottom: 0 }}>
                Our <em>Core Values</em>
              </div>
            </div>
            <div className="au-values-grid">
              {[
                { icon: '🤝', color: 'vi-rose', title: 'Inclusivity', desc: 'We welcome women of every background, culture, and stage of life. No woman is left behind on this platform.' },
                { icon: '🔒', color: 'vi-teal', title: 'Safe Spaces', desc: 'Every conversation on EmpowerHer is rooted in trust, confidentiality, and mutual respect between mentors and mentees.' },
                { icon: '⚖️', color: 'vi-amber', title: 'Gender Equity', desc: 'We are unapologetically committed to closing the gender gap in leadership, pay, rights, and opportunity globally.' },
                { icon: '🌐', color: 'vi-teal', title: 'Global Reach', desc: 'With mentors and members in 62 countries, our network crosses borders to connect women who lift each other up.' },
                { icon: '💡', color: 'vi-rose', title: 'Knowledge Access', desc: 'Legal guides, career tools, and wellness resources are freely available because informed women change the world.' },
                { icon: '🌱', color: 'vi-amber', title: 'Continuous Growth', desc: 'We believe growth never stops. Our programs evolve with the women we serve, meeting them where they are.' },
              ].map(v => (
                <div className="au-value-card" key={v.title}>
                  <div className={`au-value-icon ${v.color}`}>{v.icon}</div>
                  <div className="au-value-title">{v.title}</div>
                  <div className="au-value-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STATS STRIP ── */}
          <div className="au-stats-strip">
            {[
              { num: '48K+', desc: 'Women Empowered' },
              { num: '1,200', desc: 'Verified Mentors' },
              { num: '94%', desc: 'Career Growth Rate' },
              { num: '62', desc: 'Countries Reached' },
              { num: '4.9★', desc: 'Average Mentor Rating' },
            ].map(s => (
              <div className="au-stat" key={s.desc}>
                <div className="au-stat-num">{s.num}</div>
                <div className="au-stat-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* ── TEAM ── */}
          <div className="au-team">
            <div className="au-team-header">
              <div className="au-section-label" style={{ textAlign: 'center' }}>The Guides Behind the Platform</div>
              <div className="au-section-title" style={{ textAlign: 'center', marginBottom: 0 }}>
                Meet Our <em>Leadership</em>
              </div>
            </div>
            <div className="au-team-grid">
              {[
                { init: 'A', bg: 'tb1', name: 'Amara Osei', role: 'Co-Founder & CEO', tag: 'Gender Policy', tagCls: '' },
                { init: 'P', bg: 'tb2', name: 'Priya Sharma', role: 'Co-Founder & CTO', tag: 'STEM & Tech', tagCls: 'teal' },
                { init: 'S', bg: 'tb3', name: 'Sofia Martinez', role: 'Head of Community', tag: 'Legal Rights', tagCls: 'amber' },
              ].map(m => (
                <div className="au-team-card" key={m.name}>
                  <div className={`au-team-banner ${m.bg}`}>
                    <div className="au-team-avatar">{m.init}</div>
                  </div>
                  <div className="au-team-info">
                    <div className="au-team-name">{m.name}</div>
                    <div className="au-team-role">{m.role}</div>
                    <span className={`au-team-tag ${m.tagCls}`}>{m.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="au-cta">
            <div className="au-cta-title">
              Join Us &amp; Take the<br /><em>First Step</em> Forward
            </div>
            <div className="au-cta-sub">
              Become part of a global community of women who believe in each other.
              Your growth journey starts with a single connection.
            </div>
            <div className="au-cta-btns">
              <Link to="/register" className="au-btn-primary">Join EmpowerHer →</Link>
              <Link to="/menteedash" className="au-btn-outline">Find a Mentor</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}