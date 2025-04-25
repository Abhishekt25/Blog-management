"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogDetails = exports.deleteBlog = exports.updateBlog = exports.getEditBlog = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create a blog
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).send("Unauthorized: User not found.");
        }
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const userId = req.user.userId;
        yield Blog_1.default.create({ title, description, image, userId });
        // Redirect to the blogs list after successful creation
        res.redirect("/blogs");
    }
    catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).send("Server error.");
    }
});
exports.createBlog = createBlog;
// Read all blogs
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("User data in getAllBlogs:", req.user);
        const blogs = yield Blog_1.default.find();
        const userId = req.user.userId;
        const profileImage = req.user.profileImage ? `/uploads/${req.user.profileImage}` : '/images/default-profile.png';
        // console.log("Profile Image in getAllBlogs:", profileImage);
        const blogsWithAccess = blogs.map((blog) => (Object.assign(Object.assign({}, blog.toObject()), { canEdit: blog.userId.toString() === userId.toString() })));
        res.render('blogs/blogList', {
            blogs: blogsWithAccess,
            userId,
            profileImage
        });
    }
    catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Server error.');
    }
});
exports.getAllBlogs = getAllBlogs;
// Get blog details for editing
const getEditBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).send("Unauthorized: User not found.");
        }
        const blogId = req.params.id; // Get blog ID from URL
        // Fetch the specific blog
        const blog = yield Blog_1.default.findById(blogId);
        if (!blog) {
            return res.status(404).send("Blog not found.");
        }
        const userId = req.user.userId;
        const profileImage = req.user.profileImage ? `/uploads/${req.user.profileImage}` : '/images/default-profile.png';
        res.render("blogs/editBlog", {
            blog,
            userId,
            profileImage
        });
    }
    catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).send("Server error.");
    }
});
exports.getEditBlog = getEditBlog;
// Update blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog)
            return res.status(404).send('Blog not found.');
        if (req.file) {
            // Delete old image if exists
            if (blog.image) {
                const oldImagePath = path_1.default.resolve(__dirname, '../public/uploads/', blog.image);
                try {
                    if (fs_1.default.existsSync(oldImagePath)) {
                        fs_1.default.unlinkSync(oldImagePath);
                    }
                }
                catch (unlinkError) {
                    console.error('Error deleting old image:', unlinkError);
                }
            }
            blog.image = req.file.filename;
        }
        blog.title = title;
        blog.description = description;
        yield blog.save();
        res.redirect('/blogs');
    }
    catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send('Server error.');
    }
});
exports.updateBlog = updateBlog;
// Delete blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog)
            return res.status(404).send('Blog not found.');
        if (blog.image) {
            const imagePath = path_1.default.resolve(__dirname, '../public/uploads/', blog.image);
            try {
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            catch (unlinkError) {
                console.error('Error deleting image:', unlinkError);
            }
        }
        yield blog.deleteOne();
        res.redirect('/blogs');
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).send('Server error.');
    }
});
exports.deleteBlog = deleteBlog;
// view blog
const getBlogDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const blogId = req.params.id;
        // console.log("Fetching blog with ID:", blogId);
        const blog = yield Blog_1.default.findById(blogId); // Fetch blog by ID
        if (!blog) {
            return res.status(404).send("Blog not found.");
        }
        // Fetch user details
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || null;
        const profileImage = req.user.profileImage ? `/uploads/${req.user.profileImage}` : '/images/default-profile.png';
        res.render("blogs/viewBlog", {
            blog,
            userId,
            profileImage,
        });
    }
    catch (error) {
        console.error("Error fetching blog details:", error);
        res.status(500).send("Server error.");
    }
});
exports.getBlogDetails = getBlogDetails;
