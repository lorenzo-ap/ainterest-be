import express from 'express';
import {
	createPost,
	deletePost,
	generateImage,
	getPosts,
	getUserPosts,
	likePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);

router.get('/:id', getUserPosts);
router.put('/:id', protect, likePost);
router.delete('/:id', protect, deletePost);

router.post('/generate-image', protect, generateImage);

export default router;
