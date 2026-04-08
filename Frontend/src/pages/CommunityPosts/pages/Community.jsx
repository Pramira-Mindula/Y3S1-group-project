import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle search & category filter
  useEffect(() => {
    let tempPosts = [...posts];

    // Filter by category
    if (categoryFilter !== "All") {
      tempPosts = tempPosts.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by search term (title + description)
    if (searchTerm.trim() !== "") {
      tempPosts = tempPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(tempPosts);
  }, [searchTerm, categoryFilter, posts]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Forum</h1>

      {/* Create Post Form */}
      <CreatePost refresh={fetchPosts} />

      {/* Search + Category Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Safety">Safety</option>
          <option value="Health">Health</option>
          <option value="Legal">Legal</option>
        </select>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post) => <PostCard key={post._id} post={post} refresh={fetchPosts} />)
      )}
    </div>
  );
};

export default Community;