import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts } from "../services/postService";
import CommentSection from "../components/CommentSection";

const categoryColors = {
  General: "bg-[#E1F5EE] text-[#0F6E56]",
  Safety:  "bg-[#FAEEDA] text-[#854F0B]",
  Health:  "bg-[#FBEAF0] text-[#993556]",
  Legal:   "bg-[#E1F5EE] text-[#0F6E56]",
};

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await getPosts();
      const found = data.find((p) => p._id === id);
      setPost(found);
    };
    fetchPost();
  }, [id]);

  /* ── Loading state ── */
  if (!post) return (
    <div className="bg-[#fdf8f5] min-h-screen flex items-center justify-center">
      <p
        className="text-sm font-light text-[#B4B2A9] animate-pulse"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Loading post…
      </p>
    </div>
  );

  const badgeClass = categoryColors[post.category] || categoryColors.General;

  return (
    <div className="bg-[#fdf8f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-12 py-16">

        {/* ── BACK BUTTON ── */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-1.5 text-sm font-medium
            text-[#5F5E5A] hover:text-[#D4537E]
            transition-colors duration-200 mb-8
          "
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          ← Back
        </button>

        {/* ── POST CARD ── */}
        <div className="bg-white border border-[#e8ddd8] rounded-3xl p-8 mb-6">

          {/* Category badge */}
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${badgeClass} mb-4 inline-block`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {post.category}
          </span>

          {/* Title */}
          <h1
            className="text-3xl font-bold text-[#2C2C2A] leading-snug mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>

          {/* Author */}
          <p
            className="text-xs font-light text-[#B4B2A9] mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Posted by{" "}
            <span className="text-[#5F5E5A] font-medium">
              {post.user?.username}
            </span>
          </p>

          {/* Divider */}
          <hr className="border-[#e8ddd8] mb-6" />

          {/* Description */}
          <p
            className="text-base font-light text-[#5F5E5A] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {post.description}
          </p>
        </div>

        {/* ── COMMENTS CARD ── */}
        <div className="bg-white border border-[#e8ddd8] rounded-3xl px-8 py-6">
          <p
            className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Discussion
          </p>
          <h2
            className="text-xl font-bold text-[#2C2C2A] mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.comments.length > 0
              ? `${post.comments.length} Comment${post.comments.length !== 1 ? "s" : ""}`
              : "Be the First to Comment"}
          </h2>

          <CommentSection post={post} />
        </div>

      </div>
    </div>
  );
};

export default SinglePost;