import express from 'express';
import { createPost, deletePosts, getPosts } from '../controllers/postsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.delete('/', protect, deletePosts);

export default router;
