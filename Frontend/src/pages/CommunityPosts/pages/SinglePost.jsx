import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../services/postService";
import CommentSection from "../components/CommentSection";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await getPosts();
      const found = data.find((p) => p._id === id);
      setPost(found);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold">{post.title}</h1>
      <p className="text-gray-500">
        {post.user?.username} • {post.category}
      </p>

      <p className="mt-3">{post.description}</p>

      <CommentSection post={post} />
    </div>
  );
};

export default SinglePost;