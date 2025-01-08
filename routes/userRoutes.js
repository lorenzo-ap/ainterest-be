import express from 'express';
import { currentUser, editUser, loginUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/current', protect, currentUser);
router.put('/edit', protect, editUser);

export default router;
