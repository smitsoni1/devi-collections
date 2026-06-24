import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductImage,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, adminOnly, upload.array('images', 5), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, upload.array('images', 5), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);
router.delete('/:id/images/:imageId', protect, adminOnly, deleteProductImage);

export default router;
