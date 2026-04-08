import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    const { data } = await getPosts();

    const myPosts = data.filter(
      (p) => p.user?._id === user.user._id
    );

    setPosts(myPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Posts</h2>

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isOwner={true}
          refresh={fetchPosts}
        />
      ))}
    </div>
  );
};

export default MyPosts;