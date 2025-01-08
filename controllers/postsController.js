import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
	@desc Get all posts
	@route GET /api/v1/posts
	@access Public
**/
const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({});

		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const getUserPosts = async (req, res) => {
	try {
		const { id } = req.params;

		const posts = await Post.find({ 'user._id': id });

		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

/**
	@desc Create post
	@route POST /api/v1/posts
	@access Private
**/
const createPost = async (req, res) => {
	try {
		const { prompt, photo } = req.body;
		const { _id, username, email, photo: userPhoto } = req.user;

		const cloudinaryPhoto = await cloudinary.uploader.upload(photo);
		const newPost = await Post.create({
			user: {
				_id,
				username,
				email,
				photo: userPhoto,
			},
			prompt,
			photo: cloudinaryPhoto.secure_url,
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

/**
	@desc Delete all posts
	@route DELETE /api/v1/posts
	@access Private
**/
const deletePosts = async (req, res) => {
	try {
		await Post.deleteMany({});

		res.status(200).json({ success: true, message: 'All posts deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export { createPost, deletePosts, getPosts, getUserPosts };
