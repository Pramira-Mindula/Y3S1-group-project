import React from "react";
import { deletePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  General: "bg-[#E1F5EE] text-[#0F6E56]",
  Safety:  "bg-[#FAEEDA] text-[#854F0B]",
  Health:  "bg-[#FBEAF0] text-[#993556]",
  Legal:   "bg-[#E1F5EE] text-[#0F6E56]",
};

const PostCard = ({ post, isOwner = false, refresh }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      await deletePost(post._id);
      refresh();
    }
  };

  const categoryStyle = categoryColors[post.category] || categoryColors.General;

  return (
    <div className="bg-white border border-[#e8ddd8] rounded-3xl p-5 aspect-square flex flex-col transition-all duration-200 hover:shadow-[0_12px_40px_rgba(212,83,126,0.08)] hover:-translate-y-0.5 overflow-hidden">

      {/* ── TOP ROW: badge + delete ── */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${categoryStyle}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {post.category}
        </span>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-[#D4537E] hover:text-[#993556] transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Delete
          </button>
        )}
      </div>

      {/* ── TITLE ── */}
      <h2
        className="text-lg font-bold text-[#2C2C2A] leading-snug mb-1 flex-shrink-0 line-clamp-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {post.title}
      </h2>

      {/* ── AUTHOR ── */}
      <p
        className="text-xs font-light text-[#B4B2A9] mb-3 flex-shrink-0"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {post.user?.username}
      </p>

      {/* ── DESCRIPTION (truncated, fills remaining space) ── */}
      <p
        className="text-sm font-light text-[#5F5E5A] leading-relaxed line-clamp-4 flex-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {post.description}
      </p>

      {/* ── ACTION ROW ── */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#e8ddd8] flex-shrink-0">

        {/* Comments — navigates to single post */}
        <button
          onClick={() => navigate(`/posts/${post._id}`)}
          className="text-sm font-medium rounded-full px-4 py-1.5 border border-[#c5b8b0] text-[#5F5E5A] hover:border-[#D4537E] hover:text-[#D4537E] transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          💬 {post.comments.length}
        </button>

        <div className="flex-1" />

        {/* Report */}
        <button
          onClick={() => navigate(`/userReport/${post._id}`)}
          className="text-sm font-medium text-[#5F5E5A] border border-[#c5b8b0] rounded-full px-4 py-1.5 hover:border-[#993556] hover:text-[#993556] transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          ⚑ Report
        </button>
      </div>

    </div>
  );
};

export default PostCard;