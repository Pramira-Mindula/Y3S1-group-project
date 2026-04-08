import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/posts`
});

// Attach token
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
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