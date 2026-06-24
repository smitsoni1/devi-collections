import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartTotal,
} from '../features/cart/cartSlice';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container-max px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛍️</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added anything yet. Explore our collection!</p>
        <Link to="/" className="btn-primary inline-flex bg-brand-600 hover:bg-brand-700 text-white shadow-none px-8">
          <FiShoppingBag className="w-5 h-5 mr-2" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
        Shopping Cart <span className="text-gray-500 text-2xl font-normal ml-2">({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Cart Items ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.product}-${item.size}`}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 shadow-sm"
            >
              <Link to={`/product/${item.product}`} className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-36 object-cover rounded-xl border border-gray-100 hover:opacity-80 transition-opacity"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <Link to={`/product/${item.product}`}>
                    <h3 className="font-bold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 text-base md:text-lg mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-bold text-gray-500 mb-3">Size: <span className="text-gray-900">{item.size}</span></p>
                </div>
                
                <p className="text-brand-600 font-bold text-xl">₹{item.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Qty Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (item.qty === 1) {
                        dispatch(removeFromCart({ product: item.product, size: item.size }));
                      } else {
                        dispatch(updateQuantity({ product: item.product, size: item.size, qty: item.qty - 1 }));
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center text-xl font-medium shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-gray-900 text-lg">{item.qty}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ product: item.product, size: item.size, qty: item.qty + 1 }))}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center text-xl font-medium shadow-sm"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <p className="font-bold text-gray-900 text-lg sm:mb-2 hidden sm:block">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart({ product: item.product, size: item.size }))}
                    className="text-red-500 hover:bg-red-50 p-2.5 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
                    aria-label="Remove item"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ──────────────────────────────────────────────── */}
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Shipping</span>
                <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 font-bold text-center">
                  Add ₹{(999 - subtotal).toFixed(0)} more for FREE shipping 🎉
                </p>
              )}
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Estimated Tax (18%)</span>
                <span className="font-bold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <hr className="border-gray-200 my-4" />
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Coupon (UI only) */}
            <div className="flex gap-2 mb-6">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-1 flex-1 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                <FiTag className="w-4 h-4 text-gray-400" />
                <input placeholder="Coupon code" className="bg-transparent outline-none w-full text-sm text-gray-900 placeholder-gray-400 py-2" />
              </div>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Apply</button>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-base"
              id="proceed-checkout-btn"
            >
              Proceed to Checkout <FiArrowRight className="w-5 h-5" />
            </button>

            <Link to="/" className="block text-center text-sm text-brand-600 font-bold hover:text-brand-800 transition-colors mt-6">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
