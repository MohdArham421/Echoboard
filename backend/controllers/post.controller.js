import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    let imageUrl = null;

    // Upload to Cloudinary if image exists
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "echoboard_posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      text,
      image: imageUrl,
      user: req.user._id,
    });

    res.status(201).json(post);

  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔥 OWNER CHECK
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};