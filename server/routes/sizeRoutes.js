import express from 'express';
import {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
} from '../controllers/sizeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSizes)
  .post(protect, adminOnly, createSize);

router.route('/:id')
  .put(protect, adminOnly, updateSize)
  .delete(protect, adminOnly, deleteSize);

export default router;
