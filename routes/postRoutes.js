import express from 'express';
import { createPost, deletePosts, getPosts, getUserPosts, likePost } from '../controllers/postsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);

router.get('/:id', getUserPosts);
router.put('/:id', protect, likePost);
router.delete('/:id', protect, deletePosts);

export default router;
