import express from 'express';
import { loginUser, logoutUser, refreshToken, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);

export default router;
