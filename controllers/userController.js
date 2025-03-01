import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';
import User from '../models/user.js';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
	@desc Get user data
	@route GET /api/v1/users/current
	@access Private
**/
const currentUser = async (req, res) => {
	const { _id, username, email, photo, role } = req.user;

	return res.status(200).json({
		_id,
		username,
		email,
		photo,
		role,
	});
};

/**
	@desc Get user data by username
	@route GET /api/v1/users/:username
	@access Private
**/
const getUserByUsername = async (req, res) => {
	const user = await User.findOne({ username: req.params.username });

	if (!user) {
		return res.status(400).json({ message: 'User not found' });
	}

	return res.status(200).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: user.photo,
		role: user.role,
	});
};

/**
 * @desc Edit user data
 * @route PUT /api/v1/users/edit
 * @access Private
 */
const editUser = async (req, res) => {
	const { username, email, photo } = req.body;

	const user = await User.findById(req.user._id);

	if (!user) {
		return res.status(400).json({ message: 'User not found' });
	}

	// Update user fields
	if (username) user.username = username;
	if (email) user.email = email;

	if (photo) {
		const cloudinaryPhoto = await cloudinary.uploader.upload(`data:image/jpeg;base64,${photo}`, {
			folder: 'users',
			width: 150,
			crop: 'scale',
		});

		user.photo = cloudinaryPhoto.secure_url;
	}

	await user.save();

	await Post.updateMany(
		{ 'user._id': user._id },
		{
			'user.username': user.username,
			'user.email': user.email,
			'user.photo': user.photo,
		}
	);

	return res.status(200).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: user.photo,
		role: user.role,
	});
};

export { currentUser, editUser, getUserByUsername };
