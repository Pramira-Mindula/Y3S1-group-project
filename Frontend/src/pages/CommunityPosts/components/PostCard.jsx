import React, { useState } from "react";
import { deletePost, updatePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, isOwner = false, refresh }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title: post.title, 
    description: post.description 
  });

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post._id);
        refresh();
      } catch (err) {
        alert("Delete failed. Please check your connection.");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePost(post._id, editData);
      setIsEditing(false);
      refresh();
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <div className="bg-white border border-[#e8ddd8] rounded-3xl p-6 flex flex-col transition-all duration-200 hover:shadow-lg relative min-h-[220px]">
      
      {isEditing ? (
        /* ── EDIT MODE ── */
        <form onSubmit={handleUpdate} className="flex flex-col h-full gap-3">
          <input 
            className="text-sm border border-[#c5b8b0] rounded-lg p-2 outline-[#D4537E]"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            required
          />
          <textarea 
            className="text-xs border border-[#c5b8b0] rounded-lg p-2 flex-1 min-h-[80px] resize-none outline-[#D4537E]"
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="text-xs bg-[#1D9E75] text-white px-4 py-2 rounded-full font-medium">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-xs bg-gray-100 text-[#5F5E5A] px-4 py-2 rounded-full font-medium">Cancel</button>
          </div>
        </form>
      ) : (
        /* ── VIEW MODE ── */
        <>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold bg-[#E1F5EE] text-[#0F6E56] px-3 py-1 rounded-full uppercase">
              {post.category}
            </span>
            
            {/* The conditional check for Owner buttons */}
            {isOwner && (
              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                  className="text-[11px] font-bold text-[#1D9E75] hover:text-[#0F6E56] transition-colors"
                >
                  EDIT
                </button>
                <button 
                  onClick={handleDelete} 
                  className="text-[11px] font-bold text-[#D4537E] hover:text-[#993556] transition-colors"
                >
                  DELETE
                </button>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-[#2C2C2A] mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h2>

          <p className="text-sm font-light text-[#5F5E5A] line-clamp-3 mb-6 flex-1">
            {post.description}
          </p>

          <div className="pt-4 border-t border-[#e8ddd8] flex items-center justify-between">
            <button 
              onClick={() => navigate(`/posts/${post._id}`)} 
              className="text-xs font-medium text-[#5F5E5A] hover:text-[#D4537E] transition-colors"
            >
              💬 {post.comments?.length || 0} Comments
            </button>
            <button 
              onClick={() => navigate(`/posts/${post._id}`)} 
              className="text-xs font-bold text-[#D4537E] flex items-center gap-1"
            >
              READ FULL POST →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;