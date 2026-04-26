// src/Pages/AdminAllPosts.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .aap-root { font-family: 'DM Sans', sans-serif; }
  .aap-card { transition: all 0.22s; }
  .aap-card:hover { border-color: #ED93B1 !important; transform: translateY(-2px); box-shadow: 0 10px 36px rgba(212,83,126,0.08); }
  .aap-del-btn:hover { background: #E24B4A !important; color: white !important; border-color: #E24B4A !important; }
  .aap-comment { transition: background 0.15s; }
  .aap-comment:hover { background: #fdf5f8 !important; }
`;

const CAT_STYLES = {
  General: { bg: "#EEEDFE", color: "#534AB7", dot: "#7F77DD" },
  Safety:  { bg: "#FAEEDA", color: "#854F0B", dot: "#EF9F27" },
  Health:  { bg: "#E1F5EE", color: "#0F6E56", dot: "#1D9E75" },
  Legal:   { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
  default: { bg: "#F1EFE8", color: "#5F5E5A", dot: "#888780" },
};

const AVATAR_COLORS = [
  { bg: "#FBEAF0", color: "#D4537E" },
  { bg: "#E1F5EE", color: "#1D9E75" },
  { bg: "#FAEEDA", color: "#EF9F27" },
  { bg: "#E6F1FB", color: "#378ADD" },
  { bg: "#EEEDFE", color: "#7F77DD" },
];

const getAvatar = (str, idx) => AVATAR_COLORS[(str?.charCodeAt(0) || idx) % AVATAR_COLORS.length];

export default function AdminAllPosts() {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [confirmId, setConfirmId]   = useState(null);
  const [expanded, setExpanded]     = useState({});
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("All");

  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { setError("Unauthorized: please log in to view posts."); return; }
      const res = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching posts. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Unauthorized: please log in."); return; }
    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Unauthorized: please log in again.");
      }
    } finally {
      setConfirmId(null);
    }
  };

  useEffect(() => { fetchAllPosts(); }, []);

  const toggleExpanded = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filtered = posts.filter(p => {
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchSearch = !search.trim() ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="aap-root flex flex-col items-center justify-center py-24 gap-4">
          <div className="rounded-full border-2 animate-spin"
            style={{ width: 36, height: 36, borderColor: "#ED93B1", borderTopColor: "transparent" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#2C2C2A" }}>
            Loading posts…
          </p>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="aap-root flex flex-col items-center justify-center py-24 gap-3">
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#2C2C2A", fontWeight: 700 }}>
            Something went wrong
          </p>
          <p style={{ fontSize: "0.88rem", color: "#5F5E5A", fontWeight: 300 }}>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="aap-root">

        {/* ── Page Header ── */}
        <div className="mb-6">
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: "#1D9E75", fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>
            Admin
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2C2C2A", marginBottom: 4 }}>
            Community <span style={{ color: "#D4537E", fontStyle: "italic" }}>Posts</span>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#5F5E5A", fontWeight: 300 }}>
            Review, moderate, and remove community posts across the platform.
          </p>
        </div>

        {/* ── Stat Strip ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "📝", label: "Total Posts",    value: posts.length,                                              bg: "#FBEAF0", color: "#D4537E" },
            { icon: "💬", label: "Total Comments", value: posts.reduce((a, p) => a + (p.comments?.length || 0), 0), bg: "#E1F5EE", color: "#1D9E75" },
            { icon: "🔍", label: "Showing",        value: filtered.length,                                           bg: "#FAEEDA", color: "#EF9F27" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl"
              style={{ background: "white", border: "0.5px solid #e8ddd8", padding: "1rem 1.2rem" }}>
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-xl"
                style={{ width: 42, height: 42, background: s.bg }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.55rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.68rem", color: "#5F5E5A", fontWeight: 300, marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & Filters ── */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Search */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm pointer-events-none" style={{ color: "#888780" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full"
              style={{ border: "0.5px solid #e8ddd8", background: "white", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2A", outline: "none" }}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  border: "0.5px solid #e8ddd8",
                  background: catFilter === cat ? "#2C2C2A" : "white",
                  color: catFilter === cat ? "white" : "#5F5E5A",
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                }}>
                {cat}
              </button>
            ))}
            <span className="ml-auto text-xs font-light" style={{ color: "#888780" }}>
              {filtered.length} post{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl gap-3"
            style={{ background: "white", border: "0.5px solid #e8ddd8" }}>
            <span style={{ fontSize: "2.8rem" }}>📭</span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#2C2C2A", fontWeight: 700 }}>No posts found</p>
            <p style={{ fontSize: "0.85rem", color: "#5F5E5A", fontWeight: 300 }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          /* ── Posts Grid ── */
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((post, i) => {
              const cat = CAT_STYLES[post.category] || CAT_STYLES.default;
              const av  = getAvatar(post.user?.username, i);
              const isOpen = expanded[post._id];

              return (
                <div key={post._id} className="aap-card rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: "white", border: "0.5px solid #e8ddd8" }}>

                  {/* Card Top Colour Strip */}
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ background: cat.bg, borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.65)", color: cat.color, border: `0.5px solid ${cat.dot}30` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cat.dot, display: "inline-block" }} />
                      {post.category || "General"}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(44,44,42,0.5)", fontWeight: 300 }}>
                      {post.comments?.length || 0} comment{post.comments?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-4">

                    {/* Author Row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex items-center justify-center rounded-full flex-shrink-0 font-bold text-sm"
                        style={{ width: 32, height: 32, background: av.bg, color: av.color, fontFamily: "'Playfair Display', serif" }}>
                        {(post.user?.username || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#2C2C2A" }}>
                          {post.user?.username || "Unknown"}
                        </p>
                        <p className="text-xs font-light" style={{ color: "#888780" }}>
                          {post.user?.role || "user"}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C2C2A", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm font-light leading-relaxed flex-1 mb-4"
                      style={{ color: "#5F5E5A", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: "0.5px solid #f5efec" }}>
                      {/* Comments toggle */}
                      {post.comments?.length > 0 ? (
                        <button onClick={() => toggleExpanded(post._id)}
                          className="text-xs font-medium flex items-center gap-1.5 transition-colors"
                          style={{ color: isOpen ? "#D4537E" : "#5F5E5A", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                          💬 {isOpen ? "Hide" : "View"} {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
                        </button>
                      ) : (
                        <span className="text-xs font-light" style={{ color: "#B4B2A9" }}>No comments yet</span>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => setConfirmId(post._id)}
                        className="aap-del-btn inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                        style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid rgba(163,45,45,0.2)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* ── Comments Panel ── */}
                  {isOpen && post.comments?.length > 0 && (
                    <div style={{ borderTop: "0.5px solid #f0e8e4", background: "#fdf8f5" }}>
                      <div className="px-4 pt-3 pb-1">
                        <p style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5F5E5A" }}>
                          Comments
                        </p>
                      </div>
                      <div className="px-4 pb-4 flex flex-col gap-2">
                        {post.comments.map((c, ci) => {
                          const cav = getAvatar(c.user?.username, ci);
                          return (
                            <div key={c._id || c.createdAt}
                              className="aap-comment flex items-start gap-2.5 rounded-xl p-2.5"
                              style={{ background: "white", border: "0.5px solid #e8ddd8" }}>
                              <div className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                                style={{ width: 26, height: 26, background: cav.bg, color: cav.color, fontFamily: "'Playfair Display', serif" }}>
                                {(c.user?.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium mb-0.5" style={{ color: "#2C2C2A" }}>
                                  {c.user?.username || "Unknown"}
                                </p>
                                <p className="text-sm font-light leading-relaxed" style={{ color: "#5F5E5A" }}>
                                  {c.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Confirm Delete Modal ── */}
        {confirmId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(44,44,42,0.5)" }}
            onClick={e => { if (e.target === e.currentTarget) setConfirmId(null); }}>
            <div className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: "white", border: "0.5px solid #e8ddd8" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🗑️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C2C2A", marginBottom: "0.4rem" }}>
                Delete Post?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#5F5E5A", fontWeight: 300, lineHeight: 1.6, marginBottom: "1.5rem" }}>
                This post and all its comments will be permanently removed from the platform.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmId(null)}
                  style={{ padding: "0.6rem 1.3rem", borderRadius: 50, fontSize: "0.85rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", background: "none", border: "0.5px solid #e8ddd8", color: "#5F5E5A" }}>
                  Cancel
                </button>
                <button onClick={() => deletePost(confirmId)}
                  style={{ padding: "0.6rem 1.4rem", borderRadius: 50, fontSize: "0.85rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", background: "#E24B4A", color: "white", border: "none" }}>
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