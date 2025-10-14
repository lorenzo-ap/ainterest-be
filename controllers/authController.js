import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const cookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'none',
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	path: '/api/v1/auth/refresh'
};

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
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
		password: hashedPassword
	});

	if (!user) {
		return res.status(400).json({ message: 'Invalid user data' });
	}

	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken(user._id);

	user.refreshToken = refreshToken;
	await user.save();

	res.cookie('refreshToken', refreshToken, cookieOptions);

	return res.status(201).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: '',
		role: user.role,
		accessToken
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

	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken(user._id);

	user.refreshToken = refreshToken;
	await user.save();

	res.cookie('refreshToken', refreshToken, cookieOptions);

	return res.status(200).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		photo: user.photo,
		role: user.role,
		accessToken
	});
};

const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: '5m' // 5 minutes
	});
};

const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '7d' // 7 days
	});
};

/**
	@desc Refresh access token
	@route POST /api/v1/auth/refresh
	@access Public
**/
const refreshToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(401).json({ message: 'Refresh token required' });
	}

	try {
		// Verify refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

		// Find user and check if refresh token matches
		const user = await User.findById(decoded.id);

		if (!user || user.refreshToken !== refreshToken) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		const newAccessToken = generateAccessToken(user._id);

		return res.status(200).json({
			accessToken: newAccessToken
		});
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: 'Your session has expired, please sign in again' });
	}
};

/**
	@desc Logout user
	@route POST /api/v1/auth/logout
	@access Private
**/
const logoutUser = async (req, res) => {
	try {
		// Remove refresh token from database
		await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

		// Clear refresh token cookie
		res.clearCookie('refreshToken', {
			path: '/api/v1/auth/refresh'
		});

		return res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export { loginUser, logoutUser, refreshToken, registerUser };
