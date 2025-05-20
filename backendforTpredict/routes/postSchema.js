const Post = require("../database/schema/postSchema.js");
const User = require("../database/schema/userSchema.js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

async function getAllPosts(req, res) {
  const posts = await Post.find({}, "caption image result user").populate(
    "user",
    "name email username image"
  );
  return res.json({
    status: "success",
    data: posts,
  });
}

async function getSinglePost(req, res) {
  const { id } = req.params;
  const post = await Post.findById(id, "caption image result user").populate(
    "user",
    "name email username image"
  );
  if (!post) {
    return res.status(400).json({
      status: "error",
      error: "No post found with this id",
    });
  }
  return res.json({
    status: "success",
    data: post,
  });
}

async function createPost(req, res) {
  const { caption, image, result } = req.body;
  if (!caption || !image || !result) {
    return res.status(400).json({
      status: "error",
      error: "Please fill all the fields",
    });
  }
  const newPost = new Post({ caption, image, result, user: req.user._id });

  await newPost
    .save()
    .then(() =>
      res.json({
        status: "success",
        data: newPost,
      })
    )
    .catch((err) =>
      res.status(400).json({
        status: "error",
        error: err,
      })
    );
}

async function deletePost(req, res) {
  const { id } = req.params;
  await Post.findByIdAndDelete(id)
    .then(() =>
      res.json({
        status: "success",
        message: "Post deleted successfully",
      })
    )
    .catch((err) =>
      res.status(400).json({
        status: "error",
        error: err,
      })
    );
}

async function updatePost(req, res) {
  const { id } = req.params;
  const { caption, image, result } = req.body;
  if (!caption || !image || !result) {
    return res.status(400).json({
      status: "error",
      error: "Please fill all the fields",
    });
  }
  await Post.findByIdAndUpdate(id, { caption, image, result })
    .then(() =>
      res.json({
        status: "success",
        message: "Post updated successfully",
      })
    )
    .catch((err) =>
      res.status(400).json({
        status: "error",
        error: err,
      })
    );
}

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);
