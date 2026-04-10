import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    const { data } = await getPosts();
    const myPosts = data.filter((p) => p.user?._id === user.user._id);
    setPosts(myPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ── Derived stats (kept outside JSX to avoid complexity errors) ──
  const totalComments = posts.reduce((a, p) => a + (p.comments?.length || 0), 0);
  const uniqueCategories = [...new Set(posts.map((p) => p.category))].length;

  const stats = [
    { num: posts.length,    desc: "Posts Published"    },
    { num: totalComments,   desc: "Comments Received"  },
    { num: uniqueCategories, desc: "Categories Used"   },
  ];

  return (
    <div className="bg-[#fdf8f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-12 py-16">

        {/* ── PAGE HEADER ── */}
        <div className="mb-10">
          <p
            className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Your Profile
          </p>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1
              className="text-4xl font-bold text-[#2C2C2A] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              My{" "}
              <span className="text-[#D4537E] italic">Posts</span>
            </h1>

            <p
              className="text-sm font-light text-[#5F5E5A] max-w-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Everything you've shared with the community — manage, review, or delete your posts here.
            </p>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="bg-[#2C2C2A] rounded-3xl px-8 py-5 flex gap-10 mb-10 flex-wrap">
          {stats.map((s) => (
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

        {/* ── POSTS LIST ── */}
        {posts.length === 0 ? (
          <div className="bg-white border border-[#e8ddd8] rounded-3xl p-10 text-center">
            <p
              className="text-2xl font-bold text-[#2C2C2A] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No posts yet
            </p>
            <p
              className="text-sm font-light text-[#B4B2A9] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              You haven't shared anything yet. Head over to the community forum and post your first thought!
            </p>
            
              href="/community"
              className="inline-block text-sm font-medium text-white bg-[#D4537E] rounded-full px-6 py-2.5 hover:bg-[#993556] transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            <a>
              Go to Community →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p
              className="text-xs font-light text-[#B4B2A9] mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {posts.length} post{posts.length !== 1 ? "s" : ""} published
            </p>

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isOwner={true}
                refresh={fetchPosts}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPosts;