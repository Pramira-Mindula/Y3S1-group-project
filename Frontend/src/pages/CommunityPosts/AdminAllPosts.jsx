// src/Pages/AdminAllPosts.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function AdminAllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts
  const fetchAllPosts = async () => {
  try {
    const token = localStorage.getItem("token"); // automatically saved on login
    if (!token) return; // if not logged in, skip

    const res = await axios.get(`${API_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data);
  } catch (err) {
    console.error(err);
    alert("Error fetching posts. Make sure you are logged in as admin.");
  } finally {
    setLoading(false);
  }
};

//delete the post 

const deletePost = async (id) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_URL}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove deleted post from UI
    setPosts(posts.filter((post) => post._id !== id));

  } catch (err) {
    console.error(err);
    alert("Failed to delete post");
  }
};



  useEffect(() => {
    fetchAllPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Posts (Admin)</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow rounded p-4 flex flex-col"
            >
              <h2 className="text-xl font-semibold">Title : {post.title}</h2>
              <p className="text-gray-600 mt-1">Description : {post.description}</p>
              <p className="text-sm mt-2 text-gray-400">
                Category: {post.category}
              </p>
              <p className="text-sm mt-1 text-gray-400">
                Posted by: {post.user?.username || "Unknown"} ({post.user?.role})
              </p>
                
                
                <div className="bg-red-600 text-white w-[60px] rounded-sm text-center mt-1.5  "
                
                    onClick={() => deletePost(post._id)}>
                    <button>
                        
                        delete
                       
                    </button>

                </div>


              {post.comments && post.comments.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700">Comments:</h3>
                  <ul className="mt-2 space-y-1">
                    {post.comments.map((c) => (
                      <li
                        key={c._id || c.createdAt}
                        className="text-sm text-gray-600 border p-2 rounded"
                      >
                        <strong>{c.user?.username || "Unknown"}:</strong> {c.text}
                      </li>
                    ))}
                  </ul>
                


                </div>
                
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}