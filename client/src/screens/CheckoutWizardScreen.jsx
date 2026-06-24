import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiPhone, FiHome, FiCheck, FiShoppingBag, FiCreditCard } from 'react-icons/fi';
import { saveShippingAddress, clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import { useCreateOrderMutation } from '../features/orders/ordersApiSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function CheckoutWizardScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [step, setStep] = useState(1);

  // Address Form State
  const [form, setForm] = useState({
    label: shippingAddress?.label || 'Home',
    street: shippingAddress?.street || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    pincode: shippingAddress?.pincode || '',
    country: shippingAddress?.country || 'India',
    phone: shippingAddress?.phone || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(form));
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Order Calculations
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
        shippingAddress: form,
        paymentMethod: paymentMethod || 'Razorpay',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      }).unwrap();

      dispatch(clearCart());
      navigate(`/order/${order.order._id}`);
      toast.success('Order placed successfully! Redirecting to payment...');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cartItems, navigate]);

  return (
    <div className="container-max px-4 py-8 max-w-5xl mx-auto">
      {/* Visual Stepper */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-sm transition-colors ${step >= 1 ? 'bg-brand-600' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-16 h-1 transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-sm transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`w-16 h-1 transition-colors ${step >= 3 ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-sm transition-colors ${step >= 3 ? 'bg-brand-600' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                
                {/* Address Label */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Address Type</label>
                  <div className="flex gap-3">
                    {['Home', 'Work', 'Other'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setForm({ ...form, label: lbl })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          form.label === lbl
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <FiHome className="w-4 h-4" /> {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Street */}
                <div>
                  <label htmlFor="street" className="text-sm font-bold text-gray-900 mb-2 block">Street Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="street"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-11 pr-4 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                      placeholder="House No., Street, Area"
                      required
                    />
                  </div>
                </div>

                {/* City + State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="text-sm font-bold text-gray-900 mb-2 block">City</label>
                    <input
                      id="city" name="city" value={form.city}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-bold text-gray-900 mb-2 block">State</label>
                    <select
                      id="state" name="state" value={form.state}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" required
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Pincode + Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="text-sm font-bold text-gray-900 mb-2 block">PIN Code</label>
                    <input
                      id="pincode" name="pincode" value={form.pincode}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="400001"
                      pattern="[0-9]{6}" maxLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="text-sm font-bold text-gray-900 mb-2 block">Country</label>
                    <input
                      id="country" name="country" value={form.country}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-500 outline-none cursor-not-allowed" readOnly
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="text-sm font-bold text-gray-900 mb-2 block">Mobile Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm pr-3 border-r border-gray-300">+91</div>
                    <input
                      id="phone" name="phone" value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-24 pr-4 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="98765 43210"
                      pattern="[0-9]{10}" maxLength={10}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm mt-4">
                  Continue to Review
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Review & Payment</h2>
                <button onClick={() => setStep(1)} className="text-sm font-semibold text-brand-600 hover:underline">Edit Address</button>
              </div>

              {/* Shipping Address Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <FiMapPin className="w-4 h-4 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Delivering to {form.label}</h3>
                </div>
                <div className="pl-11 text-sm text-gray-600 space-y-1">
                  <p>{form.street}</p>
                  <p>{form.city}, {form.state} – {form.pincode}</p>
                  <p className="font-medium mt-2">📞 +91 {form.phone}</p>
                </div>
              </div>

              {/* Payment Method Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <FiCreditCard className="w-4 h-4 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Payment Method</h3>
                </div>
                <div className="pl-11 flex items-center gap-2">
                  <FiCheck className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-gray-900">Razorpay</span>
                  <span className="text-xs text-gray-500 ml-2">(UPI, Cards, Net Banking)</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <FiShoppingBag className="w-4 h-4 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Order Items</h3>
                </div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg border border-gray-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} · Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full md:w-80 bg-gray-50 p-6 md:p-10">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Order Summary</h3>
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium text-gray-900'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (18%)</span>
              <span className="font-medium text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-bold text-gray-900 text-lg">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={step === 1 ? handleAddressSubmit : handlePlaceOrder}
            disabled={isLoading || cartItems.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : step === 1 ? 'Continue to Review' : 'Place Order & Pay'}
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
            <FiCheck className="w-4 h-4 text-green-500" />
            100% Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
