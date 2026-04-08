import React, { useState } from "react";
import { createPost } from "../services/postService";   
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const CreatePost = ({ refresh }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General"
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");


    if (!token) {
      alert("Unauthorized: please log in first");
      return;
    }

    const res = await axios.post(
      `${API_URL}/posts`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Post created:", res.data);
    setForm({ title: "", description: "", category: "General" });
    refresh();
  } catch (err) {
    console.error("Failed to create post:", err.response?.data || err.message);
    alert(`Failed to create post: ${err.response?.data?.message || err.message}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <input
        className="w-full border p-2 mb-2"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="w-full border p-2 mb-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        className="w-full border p-2 mb-2"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option>General</option>
        <option>Safety</option>
        <option>Health</option>
        <option>Legal</option>
      </select>

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
};

export default CreatePost;