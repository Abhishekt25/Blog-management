import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import fs from 'fs';
import path from 'path';

// Create a blog
export const createBlog = async (req: any, res: any) => {
  try {
    console.log("Request User:", req.user); // Debugging

    if (!req.user || !req.user.userId) {
      return res.status(401).send("Unauthorized: User not found.");
    }

    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const userId = req.user.userId; // Fix: Use `userId`

    const blog = await Blog.create({ title, description, image, userId });

    res.redirect("/blogs");
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Server error.");
  }
};

// Read all blogs
export const getAllBlogs = async (req: any, res: any) => {
  try {
    const blogs = await Blog.findAll();
    res.render('blogs/blogList', { blogs, userId: req.user?.id, profileImage: req.user?.profileImage });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server error.');
  }
};


// Get blog details for editing
export const getEditBlog = async (req: any, res: any) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).send('Blog not found.');

    res.render('blogs/editBlog', { blog, userId: req.user?.id, profileImage: req.user?.profileImage });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Server error.');
  }
};


// Update blog
export const updateBlog = async (req: any, res: any) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).send('Blog not found.');

    if (req.file) {
      // Delete old image if exists
      if (blog.image) {
        const oldImagePath = path.resolve(__dirname, '../public/uploads/', blog.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (unlinkError) {
          console.error('Error deleting old image:', unlinkError);
        }
      }
      blog.image = req.file.filename;
    }

    blog.title = title;
    blog.description = description;
    await blog.save();

    res.redirect('/blogs');
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send('Server error.');
  }
};

// Delete blog
export const deleteBlog = async (req: any, res: any) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).send('Blog not found.');

    if (blog.image) {
      const imagePath = path.resolve(__dirname, '../public/uploads/', blog.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (unlinkError) {
        console.error('Error deleting image:', unlinkError);
      }
    }

    await blog.destroy();
    res.redirect('/blogs');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send('Server error.');
  }
};
