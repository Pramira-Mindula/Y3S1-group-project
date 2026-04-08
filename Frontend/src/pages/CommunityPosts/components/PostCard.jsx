import React, { useState } from "react";
import { deletePost } from "../services/postService";
import CommentSection from "./CommentSection";

const PostCard = ({ post, isOwner = false, refresh }) => {
  const [showComments, setShowComments] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      await deletePost(post._id);
      refresh();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold">{post.title}</h2>

      <p className="text-sm text-gray-500">
        {post.user?.username} • {post.category}
      </p>

      <p className="mt-2">{post.description}</p>

      {isOwner && (
        <button
          onClick={handleDelete}
          className="text-red-500 mt-2"
        >
          Delete
        </button>
      )}

      <button
        onClick={() => setShowComments(!showComments)}
        className="text-blue-500 mt-2 ml-3"
      >
        Comments ({post.comments.length})
      </button>

      {showComments && <CommentSection post={post} />}
    </div>
  );
};

export default PostCard;