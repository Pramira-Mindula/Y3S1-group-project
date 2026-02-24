import Post from '../models/Post.js';

// 1. Create Post
export const createPost = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newPost = await Post.create({
            user: req.user.id, // Auth middleware එකෙන් ලැබෙන ID එක
            title,
            description,
            category
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Get All Posts (පෝස්ට් දැමූ අයගේ විස්තර සමඟ)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username role') // පෝස්ට් එක දැමූ පුද්ගලයාගේ විස්තර
            .populate('comments.user', 'username role mentorDetails') // කොමෙන්ට් කළ අයගේ විස්තර
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//updatePost
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID from URL
        const { title, description, category } = req.body;

        // 1. Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // 2. Check Ownership: Does this post belong to the user?
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        // 3. Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, description, category },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check Ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// 3. Add Comment to Post
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            user: req.user.id,
            text
        };

        post.comments.push(newComment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};