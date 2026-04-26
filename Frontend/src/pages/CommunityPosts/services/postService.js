import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/posts`
});

// Attach token — stored under 'token' key, separate from the 'user' object
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


// APIs
export const getPosts = () => API.get("/");
export const createPost = (data) => API.post("/", data);
export const addComment = (postId, text) =>
  API.post(`/${postId}/comment`, { text });
export const deletePost = (id) => API.delete(`/${id}`);
export const updatePost = (id, data) => API.put(`/${id}`, data);