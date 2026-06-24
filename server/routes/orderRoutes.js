import express from 'express';
import {
  createOrder,
  createRazorpayOrder,
  updateOrderToPaid,
  razorpayWebhook,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook must be before auth middleware (raw body needed)
router.post('/webhook/razorpay', razorpayWebhook);

router.route('/').post(protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.post('/razorpay/create', protect, createRazorpayOrder);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;
