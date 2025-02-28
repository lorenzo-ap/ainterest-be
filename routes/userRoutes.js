import express from 'express';
import { currentUser, editUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', protect, currentUser);
router.put('/edit', protect, editUser);

export default router;
