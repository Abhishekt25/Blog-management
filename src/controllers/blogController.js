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
exports.deleteBlog = exports.updateBlog = exports.getEditBlog = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create a blog
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request User:", req.user); // Debugging
        if (!req.user || !req.user.userId) {
            return res.status(401).send("Unauthorized: User not found.");
        }
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const userId = req.user.userId; // Corrected: Use `req.user.userId`
        const blog = yield Blog_1.default.create({ title, description, image, userId });
        // Corrected: Use `req.user` instead of `user`
        res.render('create', {
            userId: req.user.userId,
            username: req.user.email,
            profileImage: req.user.profileImage ? `/uploads/${req.user.profileImage}` : '/images/default-profile.png',
        });
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
    var _a, _b;
    try {
        console.log("Request User in getAllBlogs:", req.user);
        const blogs = yield Blog_1.default.findAll();
        res.render('blogs/blogList', {
            blogs,
            userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || "Guest",
            profileImage: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.profileImage) || "/images/default-profile.png"
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
    var _a;
    try {
        console.log("Request User:", req.user); // Debugging
        if (!req.user || !req.user.userId) {
            return res.status(401).send("Unauthorized: User not found.");
        }
        const blog = yield Blog_1.default.findByPk(req.params.id);
        if (!blog)
            return res.status(404).send("Blog not found.");
        res.render("blogs/editBlog", {
            blog,
            userId: req.user.userId, // Fixed userId
            profileImage: (_a = req.user.profileImage) !== null && _a !== void 0 ? _a : "/images/default-profile.png",
        });
    }
    catch (error) {
        console.error(" Error fetching blog:", error);
        res.status(500).send("Server error.");
    }
});
exports.getEditBlog = getEditBlog;
// Update blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const blog = yield Blog_1.default.findByPk(req.params.id);
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
        const blog = yield Blog_1.default.findByPk(req.params.id);
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
        yield blog.destroy();
        res.redirect('/blogs');
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).send('Server error.');
    }
});
exports.deleteBlog = deleteBlog;
