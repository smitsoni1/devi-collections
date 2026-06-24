import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../features/orders/ordersApiSlice';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard, FiShoppingBag, FiCheck } from 'react-icons/fi';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder({
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          size: item.size,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      }).unwrap();

      dispatch(clearCart());
      navigate(`/order/${order.order._id}`);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  if (!shippingAddress) {
    navigate('/shipping');
    return null;
  }

  return (
    <div className="container-max px-4 py-8">
      <CheckoutSteps currentStep={3} />
      <h1 className="page-title text-2xl mb-8 text-center">Review Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">

          {/* Shipping Address */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{shippingAddress.label}</p>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}</p>
              <p>{shippingAddress.country}</p>
              <p className="text-brand-700 font-medium">📞 +91 {shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <FiCreditCard className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Payment Method</h2>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 border border-brand-200">
              <FiCheck className="w-5 h-5 text-brand-600" />
              <span className="text-brand-800 font-medium">Razorpay</span>
              <span className="text-xs text-gray-500 ml-auto">UPI · Cards · Net Banking</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <FiShoppingBag className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 text-lg mb-5">Price Details</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="divider" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || cartItems.length === 0}
              className="w-full btn-primary py-4 text-base"
              id="place-order-btn"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : (
                'Place Order & Pay'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
