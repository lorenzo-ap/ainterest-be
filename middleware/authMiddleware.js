import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}

	try {
		// Verify access token
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		// Get user from token without password and assign it to the request object
		req.user = await User.findById(decoded.id).select('-password');

		next();
	} catch (error) {
		console.log(error);

		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Access token expired' });
		}

		return res.status(401).json({ message: 'Not authorized, invalid token' });
	}
};

export { protect };
