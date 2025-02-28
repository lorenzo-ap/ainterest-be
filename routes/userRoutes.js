import express from 'express';
import { currentUser, editUser, getUserByUsername } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', protect, currentUser);
router.put('/edit', protect, editUser);

router.get('/:username', getUserByUsername);

export default router;
