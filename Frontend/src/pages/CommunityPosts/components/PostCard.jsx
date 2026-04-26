import React, { useState } from "react";
import { deletePost, updatePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  General: "bg-[#E1F5EE] text-[#0F6E56]",
  Safety:  "bg-[#FAEEDA] text-[#854F0B]",
  Health:  "bg-[#FBEAF0] text-[#993556]",
  Legal:   "bg-[#E1F5EE] text-[#0F6E56]",
};

const PostCard = ({ post, isOwner = false, refresh }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    description: post.description,
  });
  const [isSaving, setIsSaving] = useState(false);

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post._id);
        refresh();
      } catch {
        alert("Delete failed. Please try again.");
      }
    }
  };

  /* ── UPDATE ── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData.title.trim() || !editData.description.trim()) return;
    setIsSaving(true);
    try {
      await updatePost(post._id, editData);
      setIsEditing(false);
      refresh();
    } catch {
      alert("Update failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const categoryStyle = categoryColors[post.category] || categoryColors.General;

  return (
    <>
      {/* ── EDIT MODAL OVERLAY ── */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h3
                className="text-lg font-bold text-[#2C2C2A]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Edit Post
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#B4B2A9] hover:text-[#5F5E5A] text-xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              {/* Title */}
              <div>
                <label
                  className="block text-xs font-medium text-[#5F5E5A] mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Title
                </label>
                <input
                  className="w-full text-sm border border-[#c5b8b0] rounded-xl px-3 py-2 outline-none focus:border-[#D4537E] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-xs font-medium text-[#5F5E5A] mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Description
                </label>
                <textarea
                  className="w-full text-sm border border-[#c5b8b0] rounded-xl px-3 py-2 resize-none outline-none focus:border-[#D4537E] transition-colors min-h-[120px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm font-medium text-[#5F5E5A] bg-[#f5f0ed] hover:bg-[#e8ddd8] rounded-full px-5 py-2 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="text-sm font-bold text-white bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 rounded-full px-5 py-2 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CARD ── */}
      <div className="bg-white border border-[#e8ddd8] rounded-3xl p-5 aspect-square flex flex-col transition-all duration-200 hover:shadow-[0_12px_40px_rgba(212,83,126,0.08)] hover:-translate-y-0.5 overflow-hidden">

        {/* ── TOP ROW: badge ── */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${categoryStyle}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {post.category}
          </span>
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

        {/* ── DESCRIPTION ── */}
        <p
          className="text-sm font-light text-[#5F5E5A] leading-relaxed line-clamp-4 flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {post.description}
        </p>

        {/* ── ACTION ROW ── */}
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#e8ddd8] flex-shrink-0 flex-wrap">

          {/* Comments */}
          <button
            onClick={() => navigate(`/posts/${post._id}`)}
            className="text-sm font-medium rounded-full px-4 py-1.5 border border-[#c5b8b0] text-[#5F5E5A] hover:border-[#D4537E] hover:text-[#D4537E] transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            💬 {post.comments.length}
          </button>

          <div className="flex-1" />

          {/* Owner-only: Edit + Delete */}
          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-[#1D9E75] border border-[#1D9E75] rounded-full px-4 py-1.5 hover:bg-[#1D9E75] hover:text-white transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ✏ Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-[#D4537E] border border-[#D4537E] rounded-full px-4 py-1.5 hover:bg-[#D4537E] hover:text-white transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                🗑 Delete
              </button>
            </>
          )}

          {/* Report — always visible */}
          <button
            onClick={() => navigate(`/userReport/${post._id}`)}
            className="text-sm font-medium text-[#5F5E5A] border border-[#c5b8b0] rounded-full px-4 py-1.5 hover:border-[#993556] hover:text-[#993556] transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ⚑ Report
          </button>
        </div>

      </div>
    </>
  );
};

export default PostCard;