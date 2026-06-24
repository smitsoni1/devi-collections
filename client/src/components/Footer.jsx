import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="container-max px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
                <span className="text-white font-display font-bold text-lg">D</span>
              </div>
              <div>
                <p className="font-display font-bold text-white">Devi Collections</p>
                <p className="text-xs text-brand-300">Premium Ethnic Wear</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Handpicked ethnic wear crafted with love. From daily Kurtis to
              bridal Lehengas — your one-stop destination for Indian fashion.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-500 transition-all">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-500 transition-all">
                <FiFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['Kurti', 'Saree', 'Lehenga', 'Salwar Suit', 'Dupatta', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'New Arrivals' ? '/?sort=newest' : `/?category=${item}`}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Track Order', to: '/orders' },
                { label: 'Returns & Exchange', to: '/returns' },
                { label: 'Shipping Policy', to: '/shipping-policy' },
                { label: 'Size Guide', to: '/size-guide' },
                { label: 'FAQ', to: '/faq' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <FiPhone className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <FiMail className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>support@devicollections.in</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>123 Fashion Street, Surat, Gujarat 395001</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-gray-800 border border-gray-700">
              <p className="text-xs text-gray-400">
                <span className="text-brand-400 font-medium">Fast Delivery:</span> 3–5 business days across India.
                Free shipping on orders above ₹999.
              </p>
            </div>
          </div>
        </div>

        <div className="divider border-gray-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} Devi Collections. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-brand-400 transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/color/24/000000/razorpay.png" alt="Razorpay" className="h-5 opacity-60" />
            <span className="text-xs text-gray-500">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
