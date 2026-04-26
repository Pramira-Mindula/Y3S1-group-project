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

  // 1. Delete Handler
  const handleDelete = async (e) => {
    e.stopPropagation(); // Stops the card click from navigating to single post
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post._id);
        refresh(); // Refreshes the list in MyPosts/Community
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.message || "Unauthorized"));
      }
    }
  };

  // 2. Update Handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePost(post._id, editData);
      setIsEditing(false);
      refresh();
    } catch (err) {
      alert("Update failed. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-[#e8ddd8] rounded-3xl p-5 aspect-square flex flex-col transition-all duration-200 hover:shadow-lg relative overflow-hidden">
      
      {isEditing ? (
        /* ── EDIT MODE ── */
        <form onSubmit={handleUpdate} className="flex flex-col h-full gap-2">
          <input 
            className="text-sm border rounded-lg p-2 outline-[#D4537E]"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            required
          />
          <textarea 
            className="text-xs border rounded-lg p-2 flex-1 resize-none outline-[#D4537E]"
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="text-xs bg-[#1D9E75] text-white px-4 py-1.5 rounded-full font-medium">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-xs bg-gray-100 text-[#5F5E5A] px-4 py-1.5 rounded-full font-medium">Cancel</button>
          </div>
        </form>
      ) : (
        /* ── VIEW MODE ── */
        <>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold bg-[#E1F5EE] text-[#0F6E56] px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            
            {isOwner && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-[11px] font-bold text-[#1D9E75] hover:underline"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete} 
                  className="text-[11px] font-bold text-[#D4537E] hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-[#2C2C2A] line-clamp-2 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h2>
          
          <p className="text-[10px] text-[#B4B2A9] mb-3 uppercase tracking-tighter">
            By {post.user?.username || "Community Member"}
          </p>

          <p className="text-sm font-light text-[#5F5E5A] line-clamp-4 flex-1 leading-relaxed">
            {post.description}
          </p>

          <div className="pt-3 border-t border-[#e8ddd8] flex items-center justify-between mt-3">
            <button 
              onClick={() => navigate(`/posts/${post._id}`)} 
              className="text-xs font-medium text-[#5F5E5A] flex items-center gap-1 hover:text-[#D4537E]"
            >
              💬 {post.comments?.length || 0} Comments
            </button>
            <button 
              onClick={() => navigate(`/posts/${post._id}`)} 
              className="text-xs font-bold text-[#D4537E] hover:translate-x-1 transition-transform"
            >
              View Full →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;