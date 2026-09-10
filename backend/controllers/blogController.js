const Blog = require('../models/Blog');

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.getAll();
        // Format dates if needed, or send as-is
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blogs.' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.getById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        console.error('Error fetching blog details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog details.' });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const result = await Blog.create(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, message: 'Failed to create blog.' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        await Blog.update(req.params.id, req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ success: false, message: 'Failed to update blog.' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await Blog.remove(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Failed to delete blog.' });
    }
};
