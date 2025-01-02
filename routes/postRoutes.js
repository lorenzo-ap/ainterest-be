import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import express from 'express';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts
router.get('/', async (req, res) => {
	try {
		const posts = await Post.find({});

		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		res.status(500).json({ success: false, message: error });
	}
});

// Create a new post
router.post('/', async (req, res) => {
	try {
		const { name, prompt, photo } = req.body;

		const photoUrl = await cloudinary.uploader.upload(photo);
		const newPost = new Post({
			name,
			prompt,
			photo: photoUrl.url,
		});

		await newPost.save();

		res.status(201).json({ success: true, data: newPost });
	} catch (error) {
		res.status(500).json({ success: false, message: error });
	}
});

// Delete all posts
router.delete('/', async (req, res) => {
	await Post.deleteMany({});

	res.status(200).json({ success: true, message: 'All posts deleted' });
});

export default router;
