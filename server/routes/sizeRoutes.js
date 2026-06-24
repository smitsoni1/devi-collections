import express from 'express';
import {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
} from '../controllers/sizeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSizes)
  .post(protect, admin, createSize);

router.route('/:id')
  .put(protect, admin, updateSize)
  .delete(protect, admin, deleteSize);

export default router;
