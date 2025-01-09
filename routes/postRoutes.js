import express from 'express';
import { createPost, deletePosts, getPosts, getUserPosts, likePost } from '../controllers/postsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.delete('/', protect, deletePosts);

router.get('/:id', getUserPosts);
router.put('/:id', protect, likePost);

export default router;
