import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiPhone, FiHome } from 'react-icons/fi';
import { saveShippingAddress } from '../features/cart/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(form));
    navigate('/placeorder');
  };

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
  ];

  return (
    <div className="container-max px-4 py-8 max-w-2xl mx-auto">
      <CheckoutSteps currentStep={1} />
      <h1 className="page-title text-2xl mb-8 text-center">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">

        {/* Address Label */}
        <div>
          <label className="label">Address Type</label>
          <div className="flex gap-3">
            {['Home', 'Work', 'Other'].map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setForm({ ...form, label: lbl })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.label === lbl
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-300 text-gray-500 hover:border-brand-500'
                }`}
              >
                <FiHome className="w-4 h-4" /> {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Street */}
        <div>
          <label htmlFor="street" className="label">Street Address</label>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="street"
              name="street"
              value={form.street}
              onChange={handleChange}
              className="input pl-11"
              placeholder="House No., Street, Area"
              required
            />
          </div>
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="label">City</label>
            <input
              id="city" name="city" value={form.city}
              onChange={handleChange}
              className="input" placeholder="Mumbai"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="label">State</label>
            <select
              id="state" name="state" value={form.state}
              onChange={handleChange}
              className="input" required
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Pincode + Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="label">PIN Code</label>
            <input
              id="pincode" name="pincode" value={form.pincode}
              onChange={handleChange}
              className="input" placeholder="400001"
              pattern="[0-9]{6}" maxLength={6}
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="label">Country</label>
            <input
              id="country" name="country" value={form.country}
              onChange={handleChange}
              className="input" readOnly
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="label">Mobile Number</label>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm pr-3 border-r border-gray-300">+91</div>
            <input
              id="phone" name="phone" value={form.phone}
              onChange={handleChange}
              className="input pl-24" placeholder="98765 43210"
              pattern="[0-9]{10}" maxLength={10}
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full btn-primary py-4 text-base mt-2">
          Continue to Payment →
        </button>
      </form>
    </div>
  );
}
