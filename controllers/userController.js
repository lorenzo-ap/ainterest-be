import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import Post from '../models/post.js';
import User from '../models/user.js';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
	@desc Register new user
	@route POST /api/v1/users
	@access Public
**/
const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ message: 'Please enter all fields' });
	}

	const usernameExists = await User.findOne({ username });

	if (usernameExists) {
		return res.status(400).json({ message: 'Username already taken' });
	}

	const emailExists = await User.findOne({ email });

	if (emailExists) {
		return res.status(400).json({ message: 'Email already taken' });
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	const user = await User.create({
		username,
		email,
		password: hashedPassword,
	});

	if (!user) {
		return res.status(400).json({ message: 'Invalid user data' });
	}

	return res.status(201).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: '',
		token: generateToken(user._id),
	});
};

/**
	@desc Authenticate a user
	@route POST /api/v1/users/login
	@access Public
**/
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({ message: 'Invalid email' });
	}

	const rightPassword = await bcrypt.compare(password, user.password);

	if (!rightPassword) {
		return res.status(400).json({ message: 'Invalid password' });
	}

	return res.status(200).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: user.photo,
		token: generateToken(user._id),
	});
};

/**
	@desc Get user data
	@route GET /api/v1/users/current
	@access Private
**/
const currentUser = async (req, res) => {
	const { _id, username, email, photo } = req.user;

	return res.status(200).json({
		_id,
		username,
		email,
		photo,
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
	});
};

// Generate JWT
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export { currentUser, editUser, loginUser, registerUser };
