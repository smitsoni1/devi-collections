import express from 'express';
import {
  getAllOrders,
  updateOrderToDelivered,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardMetrics,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardMetrics);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/deliver', updateOrderToDelivered);

// Users
router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;
