import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Lazy-initialize Razorpay only when payment is requested
// (prevents crash if .env keys are not yet configured)
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
    throw new Error('Razorpay keys not configured. Please fill RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ─── Helper: calculate prices ────────────────────────────────────────────────
const calcPrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty, 0
  );
  const shippingPrice = itemsPrice > 999 ? 0 : 99; // Free shipping above ₹999
  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// ─── @desc  Create new order
// ─── @route POST /api/orders
// ─── @access Private
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate stock for all items
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(orderItems);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Razorpay',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// ─── @desc  Create Razorpay order (get order_id from Razorpay)
// ─── @route POST /api/orders/razorpay/create
// ─── @access Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to pay for this order');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Create Razorpay order — amount in paisa (₹ × 100)
  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'INR',
    receipt: order._id.toString(),
    notes: {
      orderId: order._id.toString(),
      customerName: req.user.name,
      customerEmail: req.user.email,
    },
  });

  // Save razorpay order id to our order
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// ─── @desc  Verify Razorpay payment + update order + decrement stock
// ─── @route POST /api/orders/:id/pay
// ─── @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Verify signature (HMAC-SHA256)
  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed — invalid signature');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order already paid');
  }

  // Mark order as paid
  order.isPaid = new Date();
  order.orderStatus = 'processing';
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: 'captured',
    update_time: new Date().toISOString(),
  };

  await order.save();

  // ─── Atomic stock decrement using $inc ──────────────────────────────────
  const bulkOps = order.orderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product, countInStock: { $gte: item.qty } },
      update: { $inc: { countInStock: -item.qty } },
    },
  }));

  await Product.bulkWrite(bulkOps);

  res.json({ success: true, order });
});

// ─── @desc  Razorpay Webhook (server-to-server callback)
// ─── @route POST /api/orders/webhook/razorpay
// ─── @access Public (verified by signature)
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_KEY_SECRET;
  const receivedSignature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== receivedSignature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const event = req.body.event;

  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const orderId = payment.notes?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = new Date();
        order.orderStatus = 'processing';
        order.paymentResult = {
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: 'captured',
          update_time: new Date().toISOString(),
        };
        await order.save();
      }
    }
  }

  res.json({ received: true });
});

// ─── @desc  Get logged-in user's orders
// ─── @route GET /api/orders/mine
// ─── @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name images');

  res.json({ success: true, orders });
});

// ─── @desc  Get order by ID
// ─── @route GET /api/orders/:id
// ─── @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only owner or admin can view
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.roles.includes('admin')
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});
