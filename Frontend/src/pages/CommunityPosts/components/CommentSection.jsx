import React, { useState } from "react";
import { addComment } from "../services/postService";

const CommentSection = ({ post }) => {
  const [text, setText] = useState("");

  const handleComment = async () => {
    if (!text) return;

    const { data } = await addComment(post._id, text);

    post.comments = data.comments; // update UI
    setText("");
  };

  return (
    <div className="mt-3 border-t pt-2">
      {post.comments.map((c, i) => (
        <div key={i} className="mb-2">
          <p className="font-semibold text-sm">
            {c.user?.username}
          </p>
          <p>{c.text}</p>
        </div>
      ))}

      <div className="flex mt-2">
        <input
          className="border flex-1 p-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write comment..."
        />
        <button
          onClick={handleComment}
          className="bg-blue-500 text-white px-3"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentSection;