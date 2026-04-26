import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safely retrieve user ID
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData?.user?._id || userData?._id;

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      // Filter for posts belonging to this user
      const myPosts = res.data.filter((p) => (p.user?._id || p.user) === currentUserId);
      setPosts(myPosts);
    } catch (err) {
      console.error("Failed to fetch personal posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-20 text-[#B4B2A9]">Loading your stories...</div>;

  return (
    <div className="bg-[#fdf8f5] min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-[#2C2C2A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            My <span className="text-[#D4537E] italic">Dashboard</span>
          </h1>
          <p className="text-[#5F5E5A] font-light">Manage and update the experiences you've shared.</p>
        </header>

        {posts.length === 0 ? (
          <div className="bg-white border border-[#e8ddd8] rounded-3xl p-16 text-center shadow-sm">
            <h3 className="text-xl font-bold mb-4">No posts found</h3>
            <Link to="/community" className="text-[#D4537E] font-bold underline">
              Share your first post now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isOwner={true} // Hardcoded true because this is the user's own page
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