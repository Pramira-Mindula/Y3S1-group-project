import React, { useState } from "react";
import { addComment } from "../services/postService";

const CommentSection = ({ post }) => {
  const [text, setText] = useState("");

  const handleComment = async () => {
    if (!text.trim()) return;
    const { data } = await addComment(post._id, text);
    post.comments = data.comments;
    setText("");
  };

  return (
    <div className="mt-6 pt-6 border-t border-[#e8ddd8]">

      {/* Comments List */}
      <div className="flex flex-col gap-3 mb-4">
        {post.comments.length === 0 ? (
          <p className="text-sm text-[#B4B2A9] font-light italic">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          post.comments.map((c, i) => (
            <div
              key={i}
              className="bg-[#fdf8f5] border border-[#e8ddd8] rounded-2xl px-4 py-3"
            >
              <p
                className="text-sm font-bold text-[#2C2C2A] mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {c.user?.username}
              </p>
              <p
                className="text-sm text-[#5F5E5A] font-light leading-relaxed m-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
          placeholder="Write a comment…"
          className="
            flex-1 text-sm font-light text-[#2C2C2A]
            bg-white border border-[#c5b8b0]
            rounded-full px-4 py-2.5 outline-none
            placeholder:text-[#B4B2A9]
            focus:border-[#D4537E]
            transition-colors duration-200
          "
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <button
          onClick={handleComment}
          disabled={!text.trim()}
          className="
            text-sm font-medium text-white
            bg-[#D4537E] rounded-full px-5 py-2.5
            hover:bg-[#993556] hover:-translate-y-px
            disabled:bg-[#ED93B1] disabled:cursor-not-allowed disabled:translate-y-0
            transition-all duration-200 whitespace-nowrap
          "
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Post
        </button>
      </div>

    </div>
  );
};

export default CommentSection;