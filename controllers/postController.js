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

/**
	@desc Get user posts
	@route GET /api/v1/posts/:id
	@access Public
**/
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
	@desc Delete post
	@route DELETE /api/v1/posts/:id
	@access Private
**/
const deletePost = async (req, res) => {
	try {
		const { id } = req.params;

		await Post.findByIdAndDelete(id);

		res.status(200).json({ message: 'Post deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

/**
	@desc Like post
	@route PUT /api/v1/posts/:id
	@access Private
**/
const likePost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Post.findById(id);

		if (!post.likes.includes(req.user._id)) {
			post.likes.push(req.user._id);
		} else {
			post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
		}

		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

/**
 * @desc Generate an image based on the provided prompt and dimensions
 * @route POST /api/v1/posts/generate-image
 * @access Private
 */
const generateImage = async (req, res) => {
	try {
		const { prompt, size } = req.body;

		if (!prompt) {
			return res.status(400).json({ error: 'Prompt is required' });
		}

		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt,
					negative_prompt: 'NSFW',
					width: size,
					height: size,
					num_steps: process.env.IMAGE_GENERATOR_NUM_STEPS,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const imageBuffer = await response.arrayBuffer();
		const base64Image = Buffer.from(imageBuffer).toString('base64');

		res.status(200).json({
			image: `data:image/png;base64,${base64Image}`,
		});
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export { createPost, deletePost, generateImage, getPosts, getUserPosts, likePost };
