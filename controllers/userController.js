import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

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
		token: generateToken(user._id),
	});
};

/**
	@desc Get user data
	@route GET /api/v1/users/current
	@access Private
**/
const currentUser = async (req, res) => {
	const { _id, username, email } = req.user;

	return res.status(200).json({
		_id,
		username,
		email,
	});
};

// Generate JWT
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export { currentUser, loginUser, registerUser };
