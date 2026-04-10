import React, { useState } from "react";
import { createPost } from "../services/postService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const inputClass = `
  w-full text-sm font-light text-[#2C2C2A]
  bg-[#fdf8f5] border border-[#c5b8b0]
  rounded-2xl px-4 py-2.5 outline-none
  placeholder:text-[#B4B2A9]
  focus:border-[#D4537E]
  transition-colors duration-200
`;

const CreatePost = ({ refresh }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: please log in first");
        return;
      }
      const res = await axios.post(`${API_URL}/posts`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Post created:", res.data);
      setForm({ title: "", description: "", category: "General" });
      refresh();
    } catch (err) {
      console.error("Failed to create post:", err.response?.data || err.message);
      alert(`Failed to create post: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e8ddd8] rounded-3xl p-6 mb-6"
    >
      {/* Header */}
      <p
        className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Share with the community
      </p>
      <h2
        className="text-2xl font-bold text-[#2C2C2A] mb-5"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Create a Post
      </h2>

      {/* Title */}
      <input
        className={inputClass}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        placeholder="Post title…"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Description */}
      <textarea
        className={`${inputClass} resize-none mt-3`}
        style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "110px" }}
        placeholder="Share your thoughts, experience, or question…"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* Category + Button row */}
      <div className="flex items-center gap-3 mt-3">
        <select
          className={`${inputClass} flex-1`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>General</option>
          <option>Safety</option>
          <option>Health</option>
          <option>Legal</option>
        </select>

        <button
          type="submit"
          disabled={!form.title.trim() || !form.description.trim()}
          className="
            text-sm font-medium text-white
            bg-[#D4537E] rounded-full px-6 py-2.5
            hover:bg-[#993556] hover:-translate-y-px
            disabled:bg-[#ED93B1] disabled:cursor-not-allowed disabled:translate-y-0
            transition-all duration-200 whitespace-nowrap
          "
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Publish Post
        </button>
      </div>
    </form>
  );
};

export default CreatePost;