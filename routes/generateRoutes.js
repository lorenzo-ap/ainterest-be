import express from 'express';
import { generateImage } from '../controllers/generateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/image', protect, generateImage);

export default router;
