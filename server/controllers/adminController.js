import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// ─── @desc  Get all orders (admin dashboard)
// ─── @route GET /api/admin/orders
// ─── @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 20;
  const page = Number(req.query.page) || 1;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.isPaid === 'true') filter.isPaid = { $ne: null };
  if (req.query.isPaid === 'false') filter.isPaid = null;

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ success: true, orders, page, pages: Math.ceil(count / pageSize), total: count });
});

// ─── @desc  Update order to delivered
// ─── @route PUT /api/admin/orders/:id/deliver
// ─── @access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!order.isPaid) {
    res.status(400);
    throw new Error('Cannot mark unpaid order as delivered');
  }

  order.isDelivered = new Date();
  order.orderStatus = 'delivered';
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// ─── @desc  Get all users
// ─── @route GET /api/admin/users
// ─── @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 20;
  const page = Number(req.query.page) || 1;
  const count = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ success: true, users, page, pages: Math.ceil(count / pageSize), total: count });
});

// ─── @desc  Get user by ID
// ─── @route GET /api/admin/users/:id
// ─── @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// ─── @desc  Update user (roles, active status)
// ─── @route PUT /api/admin/users/:id
// ─── @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.roles) user.roles = req.body.roles;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

  const updated = await user.save();
  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      roles: updated.roles,
      isActive: updated.isActive,
    },
  });
});

// ─── @desc  Delete user
// ─── @route DELETE /api/admin/users/:id
// ─── @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.roles.includes('admin')) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});

// ─── @desc  Get dashboard metrics
// ─── @route GET /api/admin/dashboard
// ─── @access Private/Admin
export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    paidOrders,
    deliveredOrders,
    totalUsers,
    totalProducts,
    revenueResult,
    lowStockProducts,
    recentOrders,
    monthlySales,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ isPaid: { $ne: null } }),
    Order.countDocuments({ isDelivered: { $ne: null } }),
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: { $ne: null } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Product.find({ countInStock: { $lt: 5 } }).select('name countInStock category').limit(10),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
    Order.aggregate([
      { $match: { isPaid: { $ne: null } } },
      {
        $group: {
          _id: {
            year: { $year: '$isPaid' },
            month: { $month: '$isPaid' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  res.json({
    success: true,
    metrics: {
      totalOrders,
      paidOrders,
      deliveredOrders,
      pendingOrders: totalOrders - paidOrders,
      totalUsers,
      totalProducts,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      lowStockProducts,
      recentOrders,
      monthlySales: monthlySales.reverse(), // oldest to newest
    },
  });
});
