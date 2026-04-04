import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E; --rose-light: #FBEAF0; --rose-mid: #ED93B1;
    --teal: #1D9E75; --teal-light: #E1F5EE; --teal-mid: #5DCAA5;
    --dark: #2C2C2A; --muted: #5F5E5A; --surface: #fdf8f5; --white: #ffffff;
    --amber-light: #FAEEDA; --amber: #EF9F27;
    --blue-light: #E6F1FB; --blue: #378ADD;
    --green-light: #EAF3DE; --green: #639922;
    --purple-light: #EEEDFE; --purple: #7F77DD;
  }

  .rl-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 100vh;
    padding: 3rem 1.5rem 5rem;
    color: var(--dark);
  }

  .rl-inner { max-width: 1200px; margin: 0 auto; }

  /* PAGE HEADER */
  .rl-page-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 2rem;
    margin-bottom: 2.8rem; flex-wrap: wrap;
  }
  .rl-page-label {
    font-size: 0.75rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .rl-page-title {
    font-family: 'Playfair Display', serif; font-size: 2.4rem;
    font-weight: 700; color: var(--dark); line-height: 1.2; margin-bottom: 0.35rem;
  }
  .rl-page-title em { color: var(--rose); font-style: italic; }
  .rl-page-sub { font-size: 0.95rem; color: var(--muted); font-weight: 300; }

  /* SEARCH & FILTER */
  .rl-controls {
    display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
  }
  .rl-search-wrap {
    position: relative; display: flex; align-items: center;
  }
  .rl-search-icon {
    position: absolute; left: 12px; font-size: 14px; pointer-events: none;
    color: var(--muted);
  }
  .rl-search {
    padding: 0.6rem 1rem 0.6rem 2.2rem;
    border: 0.5px solid #e8ddd8; border-radius: 50px;
    font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--white); outline: none;
    transition: border-color 0.2s; width: 220px;
  }
  .rl-search::placeholder { color: #B4B2A9; font-weight: 300; }
  .rl-search:focus { border-color: var(--rose-mid); }

  /* CATEGORY PILLS */
  .rl-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .rl-cat-pill {
    font-size: 0.8rem; font-weight: 500; padding: 0.45rem 1.1rem;
    border-radius: 50px; border: 0.5px solid #e8ddd8;
    background: var(--white); color: var(--muted); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.18s;
  }
  .rl-cat-pill:hover { border-color: var(--rose-mid); color: var(--rose); }
  .rl-cat-pill.active { background: var(--dark); color: white; border-color: var(--dark); }

  /* RESOURCE GRID */
  .rl-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  /* CATEGORY COLORS */
  .cat-legal    { --cat-bg: var(--blue-light);   --cat-color: #185FA5; }
  .cat-health   { --cat-bg: var(--teal-light);   --cat-color: #0F6E56; }
  .cat-career   { --cat-bg: var(--rose-light);   --cat-color: #993556; }
  .cat-safety   { --cat-bg: var(--amber-light);  --cat-color: #854F0B; }
  .cat-default  { --cat-bg: var(--purple-light); --cat-color: #534AB7; }

  .rl-card {
    background: var(--white); border-radius: 22px;
    border: 0.5px solid #e8ddd8; overflow: hidden;
    display: flex; flex-direction: column;
    transition: all 0.25s;
  }
  .rl-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(44,44,42,0.08);
    border-color: #d5cbc5;
  }

  .rl-card-top {
    padding: 1.6rem 1.8rem 1.3rem;
    background: var(--cat-bg);
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .rl-cat-badge {
    font-size: 0.67rem; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 0.25rem 0.8rem; border-radius: 50px;
    background: rgba(255,255,255,0.65); color: var(--cat-color);
    border: 0.5px solid rgba(0,0,0,0.07);
  }
  .rl-card-icon { font-size: 1.6rem; }

  .rl-card-body {
    padding: 1.3rem 1.8rem 1.6rem;
    display: flex; flex-direction: column; flex: 1;
  }
  .rl-card-title {
    font-family: 'Playfair Display', serif; font-size: 1.08rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.6rem; line-height: 1.35;
  }
  .rl-card-content {
    font-size: 0.85rem; color: var(--muted); line-height: 1.65;
    font-weight: 300; flex: 1; margin-bottom: 1.3rem;
    display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .rl-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; border-top: 0.5px solid #f0e8e4; margin-top: auto;
  }
  .rl-read-link {
    font-size: 0.83rem; font-weight: 500; color: var(--teal);
    text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
    transition: color 0.18s;
  }
  .rl-read-link:hover { color: #085041; }
  .rl-share-btn {
    font-size: 0.8rem; font-weight: 500; color: var(--muted);
    background: none; border: 0.5px solid #e8ddd8; padding: 0.35rem 0.85rem;
    border-radius: 50px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    display: inline-flex; align-items: center; gap: 5px; transition: all 0.18s;
  }
  .rl-share-btn:hover { border-color: var(--rose-mid); color: var(--rose); }

  /* EMPTY & LOADING */
  .rl-state-box {
    grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;
    background: var(--white); border-radius: 20px; border: 0.5px solid #e8ddd8;
  }
  .rl-state-icon { font-size: 3rem; margin-bottom: 1rem; }
  .rl-state-title {
    font-family: 'Playfair Display', serif; font-size: 1.3rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.4rem;
  }
  .rl-state-sub { font-size: 0.88rem; color: var(--muted); font-weight: 300; }

  .rl-spinner {
    width: 32px; height: 32px; border: 2.5px solid var(--rose-light);
    border-top-color: var(--rose); border-radius: 50%;
    animation: rlspin 0.8s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes rlspin { to { transform: rotate(360deg); } }

  /* PAGINATION */
  .rl-pagination {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .rl-page-btn {
    font-size: 0.85rem; font-weight: 500; padding: 0.55rem 1.2rem;
    border-radius: 50px; border: 0.5px solid #e8ddd8;
    background: var(--white); color: var(--muted); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.18s;
  }
  .rl-page-btn:hover:not(:disabled) { border-color: var(--rose-mid); color: var(--rose); }
  .rl-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .rl-page-info {
    font-size: 0.83rem; color: var(--muted); font-weight: 300;
    padding: 0 0.5rem;
  }

  /* MODAL OVERLAY */
  .rl-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(44,44,42,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 1.5rem;
  }
  .rl-modal {
    background: var(--white); border-radius: 22px;
    border: 0.5px solid #e8ddd8; padding: 2.2rem;
    width: 100%; max-width: 440px;
  }
  .rl-modal-label {
    font-size: 0.72rem; letter-spacing: 0.1em; color: var(--teal);
    font-weight: 500; text-transform: uppercase; margin-bottom: 0.4rem;
  }
  .rl-modal-title {
    font-family: 'Playfair Display', serif; font-size: 1.4rem;
    font-weight: 700; color: var(--dark); margin-bottom: 0.35rem;
  }
  .rl-modal-sub {
    font-size: 0.85rem; color: var(--muted); font-weight: 300;
    margin-bottom: 1.6rem; line-height: 1.6;
  }
  .rl-modal-input {
    width: 100%; padding: 0.8rem 1rem;
    border: 0.5px solid #e8ddd8; border-radius: 14px;
    font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    color: var(--dark); background: var(--surface); outline: none;
    transition: border-color 0.2s; margin-bottom: 1.4rem;
  }
  .rl-modal-input::placeholder { color: #B4B2A9; font-weight: 300; }
  .rl-modal-input:focus { border-color: var(--rose-mid); background: var(--white); }
  .rl-modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
  .rl-modal-cancel {
    font-size: 0.88rem; font-weight: 500; color: var(--muted);
    background: none; border: 0.5px solid #e8ddd8; padding: 0.65rem 1.3rem;
    border-radius: 50px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .rl-modal-cancel:hover { border-color: #c5b8b0; color: var(--dark); }
  .rl-modal-send {
    font-size: 0.88rem; font-weight: 500; color: white;
    background: var(--rose); border: none; padding: 0.65rem 1.5rem;
    border-radius: 50px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .rl-modal-send:hover:not(:disabled) { background: #993556; transform: translateY(-1px); }
  .rl-modal-send:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  @media (max-width: 900px) { .rl-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) {
    .rl-grid { grid-template-columns: 1fr; }
    .rl-page-title { font-size: 1.9rem; }
    .rl-page-header { flex-direction: column; align-items: flex-start; }
    .rl-search { width: 100%; }
  }
`;

const CATEGORY_CLASSES = {
  Legal: 'cat-legal',
  Health: 'cat-health',
  Career: 'cat-career',
  Safety: 'cat-safety',
};

const CATEGORY_ICONS = {
  Legal: '⚖️',
  Health: '🌿',
  Career: '🚀',
  Safety: '🛡️',
};

const categories = ['Legal', 'Health', 'Career', 'Safety'];

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [emailToShare, setEmailToShare] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const safeResources = Array.isArray(resources) ? resources : [];

  useEffect(() => { fetchResources(); }, [page, category, search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page, limit: 6 });
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/resources?${queryParams}`);
      const incoming = Array.isArray(response.data?.resources) ? response.data.resources : [];
      setResources(incoming);
      const tp = Number.isInteger(response.data?.totalPages) && response.data.totalPages > 0
        ? response.data.totalPages : 1;
      setTotalPages(tp);
    } catch {
      toast.error('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/resources/share`, {
        resourceId: selectedResourceId,
        email: emailToShare
      });
      toast.success('Resource shared successfully!');
      setShareModalOpen(false);
      setEmailToShare('');
    } catch {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const openShareModal = (id) => { setSelectedResourceId(id); setShareModalOpen(true); };

  return (
    <>
      <style>{styles}</style>
      <div className="rl-page">
        <div className="rl-inner">

          {/* Page Header */}
          <div className="rl-page-header">
            <div>
              <div className="rl-page-label">Knowledge Hub</div>
              <div className="rl-page-title">Resource <em>Library</em></div>
              <div className="rl-page-sub">Guides, toolkits, and documents to support your journey.</div>
            </div>

            {/* Controls */}
            <div className="rl-controls">
              <div className="rl-search-wrap">
                <span className="rl-search-icon">🔍</span>
                <input
                  type="text"
                  className="rl-search"
                  placeholder="Search resources…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="rl-cats" style={{ marginBottom: '2rem' }}>
            <button
              className={`rl-cat-pill${category === '' ? ' active' : ''}`}
              onClick={() => { setCategory(''); setPage(1); }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`rl-cat-pill${category === cat ? ' active' : ''}`}
                onClick={() => { setCategory(cat); setPage(1); }}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          {/* Resource Grid */}
          <div className="rl-grid">
            {loading ? (
              <div className="rl-state-box">
                <div className="rl-spinner" />
                <div className="rl-state-title">Loading resources…</div>
                <div className="rl-state-sub">Just a moment</div>
              </div>
            ) : safeResources.length === 0 ? (
              <div className="rl-state-box">
                <div className="rl-state-icon">📭</div>
                <div className="rl-state-title">No resources found</div>
                <div className="rl-state-sub">Try adjusting your search or category filter.</div>
              </div>
            ) : safeResources.map(resource => {
              const catClass = CATEGORY_CLASSES[resource.category] || 'cat-default';
              const catIcon = CATEGORY_ICONS[resource.category] || '📄';
              return (
                <div key={resource._id} className={`rl-card ${catClass}`}>
                  <div className="rl-card-top">
                    <span className="rl-cat-badge">{resource.category}</span>
                    <span className="rl-card-icon">{catIcon}</span>
                  </div>
                  <div className="rl-card-body">
                    <div className="rl-card-title">{resource.title}</div>
                    <div className="rl-card-content">{resource.content}</div>
                    <div className="rl-card-footer">
                      {resource.link ? (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rl-read-link"
                        >
                          Read More →
                        </a>
                      ) : <span />}
                      <button
                        className="rl-share-btn"
                        onClick={() => openShareModal(resource._id)}
                      >
                        ✉️ Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="rl-pagination">
              <button
                className="rl-page-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </button>
              <span className="rl-page-info">Page {page} of {totalPages}</span>
              <button
                className="rl-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="rl-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShareModalOpen(false); }}>
          <div className="rl-modal">
            <div className="rl-modal-label">Share Resource</div>
            <div className="rl-modal-title">Send via Email</div>
            <div className="rl-modal-sub">
              Enter an email address to send this resource directly to someone's inbox.
            </div>
            <form onSubmit={handleShare}>
              <input
                type="email"
                required
                className="rl-modal-input"
                placeholder="e.g. friend@example.com"
                value={emailToShare}
                onChange={e => setEmailToShare(e.target.value)}
              />
              <div className="rl-modal-actions">
                <button
                  type="button"
                  className="rl-modal-cancel"
                  onClick={() => setShareModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rl-modal-send"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? 'Sending…' : 'Send Resource →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}