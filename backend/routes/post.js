const express = require("express");
const Post = require("../models/Post");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    const newPost = new Post({ ...req.body, author: req.user.userId });
    await newPost.save();
    res.status(201).json(newPost);
  });

router.get("/fetch", authenticateToken, async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

router.delete("/:id", [authenticateToken, authorizeAdmin], async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  });


module.exports = router;