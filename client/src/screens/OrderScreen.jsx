import { useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPackage, FiTruck, FiCheck, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import {
  useGetOrderByIdQuery,
  useCreateRazorpayOrderMutation,
  usePayOrderMutation,
} from '../features/orders/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';

export default function OrderScreen() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, isError, refetch } = useGetOrderByIdQuery(id);
  const [createRazorpayOrder, { isLoading: creatingPayment }] = useCreateRazorpayOrderMutation();
  const [payOrder, { isLoading: verifyingPayment }] = usePayOrderMutation();

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = useCallback(async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay. Check your internet connection.');
      return;
    }

    try {
      // Step 1: Create Razorpay order on backend
      const razorpayData = await createRazorpayOrder({ orderId: id }).unwrap();

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'Devi Collections',
        description: `Order #${id.slice(-8).toUpperCase()}`,
        order_id: razorpayData.razorpayOrderId,
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#2B6CB0',
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
          },
        },
        handler: async (response) => {
          // Step 3: Verify payment signature on backend
          try {
            await payOrder({
              id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            toast.success('🎉 Payment successful! Your order is confirmed.');
            refetch();
          } catch (verifyErr) {
            toast.error(verifyErr?.data?.message || 'Payment verification failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to initiate payment');
    }
  }, [id, userInfo, createRazorpayOrder, payOrder, refetch]);

  if (isLoading) return <Loader text="Loading order..." />;
  if (isError) return (
    <div className="container-max px-4 py-10">
      <Message type="error">Order not found</Message>
    </div>
  );

  const { order } = data;

  const statusSteps = [
    { label: 'Order Placed', done: true, icon: FiPackage },
    { label: 'Payment Done', done: !!order.isPaid, icon: FiCheck },
    { label: 'Processing', done: order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered', icon: FiPackage },
    { label: 'Shipped', done: order.orderStatus === 'shipped' || order.orderStatus === 'delivered', icon: FiTruck },
    { label: 'Delivered', done: !!order.isDelivered, icon: FiCheck },
  ];

  const currentStepIndex = statusSteps.filter((s) => s.done).length - 1;

  return (
    <div className="container-max px-4 py-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Order ID: <span className="text-brand-600 font-mono font-bold">#{id.slice(-12).toUpperCase()}</span></p>
        </div>
        <div className="flex gap-2">
          {order.isPaid && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold border border-green-200">✓ Paid</span>
          )}
          {order.isDelivered && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold border border-green-200">✓ Delivered</span>
          )}
          {!order.isPaid && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm font-bold border border-amber-200">⏳ Awaiting Payment</span>
          )}
        </div>
      </div>

      {/* Dynamic Order Status Pipeline */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-8 text-lg">Tracking Status</h2>
        <div className="flex items-center justify-between relative px-2 sm:px-10">
          <div className="absolute left-6 right-6 sm:left-14 sm:right-14 top-5 h-1 bg-gray-200 rounded-full" />
          <div
            className="absolute left-6 sm:left-14 top-5 h-1 bg-brand-600 transition-all duration-1000 rounded-full"
            style={{ width: `${(currentStepIndex) / (statusSteps.length - 1) * 100}%`, maxWidth: 'calc(100% - 3rem)' }}
          />
          {statusSteps.map(({ label, done, icon: Icon }) => (
            <div key={label} className="relative flex flex-col items-center gap-3 z-10 w-16 sm:w-24">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                done ? 'bg-brand-600 shadow-md ring-4 ring-brand-50' : 'bg-white border-2 border-gray-300'
              }`}>
                <Icon className={`w-4 h-4 ${done ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span className={`text-xs font-bold text-center leading-tight ${done ? 'text-brand-700' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Payment Alert */}
          {!order.isPaid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiAlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-lg">Payment Pending</h3>
                  <p className="text-sm text-amber-700 mt-1 font-medium">Complete your payment to confirm your order. This order will be cancelled after 24 hours if unpaid.</p>
                </div>
              </div>
              <button
                onClick={handleRazorpayPayment}
                disabled={creatingPayment || verifyingPayment}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-base"
                id="pay-now-btn"
              >
                {creatingPayment || verifyingPayment ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {creatingPayment ? 'Preparing payment...' : 'Verifying...'}
                  </span>
                ) : (
                  `Pay ₹${order.totalPrice.toLocaleString('en-IN')} via Razorpay`
                )}
              </button>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5 text-lg pb-3 border-b border-gray-100">Items Ordered</h2>
            <div className="space-y-5">
              {order.orderItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-5">
                  <img src={item.image} alt={item.name} className="w-20 h-24 rounded-xl object-cover border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="text-base font-bold text-gray-900 hover:text-brand-600 transition-colors truncate block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 font-medium">Size: <span className="text-gray-900">{item.size}</span> · Qty: <span className="text-gray-900">{item.qty}</span></p>
                    <p className="text-brand-600 font-bold text-lg mt-2">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 text-lg pb-3 border-b border-gray-100">Shipping Details</h2>
            <div className="text-sm text-gray-600 space-y-2 font-medium pl-2 border-l-2 border-gray-200">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
              <p className="text-gray-900 font-bold mt-2">📞 +91 {order.shippingAddress.phone}</p>
              {order.trackingNumber && (
                <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center gap-3">
                  <FiTruck className="w-5 h-5 text-brand-600" />
                  <p className="text-brand-700 font-bold">Tracking ID: <span className="font-mono text-gray-900">{order.trackingNumber}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5 text-lg pb-3 border-b border-gray-200">Price Breakdown</h2>
            <div className="space-y-4 text-sm mb-2">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Items Price</span>
                <span className="font-bold text-gray-900">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Shipping</span>
                <span className={`font-bold ${order.shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">GST (18%)</span>
                <span className="font-bold text-gray-900">₹{order.taxPrice?.toLocaleString('en-IN')}</span>
              </div>
              <hr className="border-gray-200 my-4" />
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total Amount</span>
                <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {order.isPaid && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-green-700 text-sm font-bold">Payment Successful</p>
                <p className="text-xs text-green-600/80 mt-1 font-medium">
                  {new Date(order.isPaid).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
