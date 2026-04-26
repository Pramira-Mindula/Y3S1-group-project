import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const CATEGORIES = ["All", "General", "Safety", "Health", "Legal"];

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Get the logged-in user's ID (same pattern as MyPosts.jsx)
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData?.user?._id || userData?._id;

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    let temp = [...posts];
    if (categoryFilter !== "All")
      temp = temp.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    if (searchTerm.trim())
      temp = temp.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredPosts(temp);
  }, [searchTerm, categoryFilter, posts]);

  const totalComments = posts.reduce((a, p) => a + (p.comments?.length || 0), 0);

  return (
    <div className="bg-[#fdf8f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-12 py-16">

        {/* ── PAGE HEADER ── */}
        <div className="mb-10">
          <p
            className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our Community
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1
              className="text-4xl font-bold text-[#2C2C2A] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Community{" "}
              <span className="text-[#D4537E] italic">Forum</span>
            </h1>
            <p
              className="text-sm font-light text-[#5F5E5A] max-w-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Share experiences, ask questions, and support one another in a safe and welcoming space.
            </p>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="bg-[#2C2C2A] rounded-3xl px-8 py-5 flex gap-10 mb-10 flex-wrap">
          {[
            { num: posts.length,    desc: "Total Posts"  },
            { num: totalComments,   desc: "Comments"     },
            { num: 4,               desc: "Categories"   },
          ].map((s) => (
            <div key={s.desc}>
              <div
                className="text-2xl font-bold text-[#ED93B1]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.num}
              </div>
              <div
                className="text-xs text-[#B4B2A9] font-light mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── CREATE POST ── */}
        <CreatePost refresh={fetchPosts} />

        {/* ── SEARCH + FILTER ── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search posts…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] text-sm font-light text-[#2C2C2A] bg-white border border-[#c5b8b0] rounded-full px-5 py-2.5 outline-none placeholder:text-[#B4B2A9] focus:border-[#D4537E] transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-sm font-medium rounded-full px-4 py-2 border transition-all duration-200 ${
                  categoryFilter === cat
                    ? "bg-[#D4537E] text-white border-[#D4537E]"
                    : "bg-white text-[#5F5E5A] border-[#c5b8b0] hover:border-[#D4537E] hover:text-[#D4537E]"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTS COUNT ── */}
        <p
          className="text-xs font-light text-[#B4B2A9] mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {filteredPosts.length === 0
            ? "No posts found"
            : `Showing ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}`}
        </p>

        {/* ── POSTS GRID ── */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-[#e8ddd8] rounded-3xl p-10 text-center">
            <p
              className="text-2xl font-bold text-[#2C2C2A] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No posts found
            </p>
            <p
              className="text-sm font-light text-[#B4B2A9]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Try a different search term or category, or be the first to post!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                refresh={fetchPosts}
                isOwner={currentUserId && (post.user?._id || post.user) === currentUserId}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Community;