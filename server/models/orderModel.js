import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String, required: true },
});

const paymentResultSchema = new mongoose.Schema({
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  status: { type: String },
  update_time: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, 'Order must have at least one item'],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },
    paymentResult: paymentResultSchema,

    // Pricing breakdown
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    // Status tracking
    isPaid: { type: Date, default: null },
    isDelivered: { type: Date, default: null },

    // Razorpay order ID from backend
    razorpayOrderId: { type: String },

    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    trackingNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual: isPaidStatus
orderSchema.virtual('isPaidStatus').get(function () {
  return !!this.isPaid;
});

// Virtual: isDeliveredStatus
orderSchema.virtual('isDeliveredStatus').get(function () {
  return !!this.isDelivered;
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
