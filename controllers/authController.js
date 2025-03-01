import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
	@desc Register new user
	@route POST /api/v1/auth/register
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
		role: user.role,
		token: generateToken(user._id),
	});
};

/**
	@desc Authenticate a user
	@route POST /api/v1/auth/login
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
		role: user.role,
		token: generateToken(user._id),
	});
};

// Generate JWT
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export { loginUser, registerUser };
