var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var blog = require("../models/blog_tab");

// POST /api/blog/add
router.post("/add", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send({ error: "Title and content are required" });
  }

  try {
    const newBlog = new blog({
      title,
      content,
    });
    await newBlog.save();
    res.status(201).send({ message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while adding the blog" });
  }
});

// GET /api/blog/read
router.get("/read", async (req, res) => {
  try {
    const blogs = await blog.find().sort({ createdAt: -1 }); // Sort by creation date in descending order
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ error: "An error occurred while fetching blogs" });
  }
});
// GET /api/blog/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid blog ID" });
  }

  try {
    const blogPost = await blog.findById(id);
    if (!blogPost) {
      return res.status(404).send({ error: "Blog not found" });
    }
    res.status(200).send(blogPost);
  } catch (error) {
    res.status(500).send({ error: "An error occurred while fetching the blog" });
  }
});
// PUT /api/blog/:id
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid blog ID" });
  }

  try {
    const updatedBlog = await blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    res.status(200).send({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while updating the blog" });
  }
});

//get a particular blog
router.get("/read/:id", async(req, res)=> {
    try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).send({ error: "News not found" });
    }
    res.status(200).send({ news });
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch news" });
  }
});
  

//all blogs by user
router.get("/all", async(req, res) =>{
   try {
      const blogs =await blog.find({})
       res.status(200).send({ allBlogs});
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch news" });
  }
});
   
// DELETE /api/blog/:id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid blog ID" });
  }

  try {
    const deletedBlog = await blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    res.status(200).send({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while deleting the blog" });
  }
});

module.exports = router;