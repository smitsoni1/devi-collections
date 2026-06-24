import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiGrid,
  FiSearch,
} from 'react-icons/fi';
import { clearCredentials, useLogoutMutation } from '../features/auth/authSlice';
import { selectCartCount, clearCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const [logoutApi] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(clearCredentials());
      dispatch(clearCart());
      navigate('/');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const categories = ['Kurti', 'Saree', 'Lehenga', 'Salwar Suit', 'Dupatta'];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container-max px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow">
              <span className="text-white font-display font-bold text-lg">D</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-gray-900 text-lg leading-none">
                Devi Collections
              </p>
              <p className="text-xs text-brand-600 leading-none mt-0.5">Premium Ethnic Wear</p>
            </div>
          </Link>

          {/* Desktop Nav — Categories */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/?category=${cat}`}
                className="btn-ghost text-sm"
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <Link to="/?search=true" className="btn-ghost p-2.5 rounded-xl" aria-label="Search">
              <FiSearch className="w-5 h-5" />
            </Link>

            {/* Cart - Hidden for Admins */}
            {(!userInfo || !userInfo.isAdmin) && (
              <Link to="/cart" className="relative btn-ghost p-2.5 rounded-xl" aria-label="Cart">
                <FiShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center animate-scale-in">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-border hover:border-brand-500 transition-all"
                  id="user-menu-btn"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700 font-medium max-w-24 truncate">
                    {userInfo.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 card border border-surface-border shadow-card-hover animate-scale-in z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userInfo.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                      >
                        <FiUser className="w-4 h-4" /> My Profile
                      </Link>
                      {(!userInfo || !userInfo.isAdmin) && (
                        <Link
                          to="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                        >
                          <FiPackage className="w-4 h-4" /> My Orders
                        </Link>
                      )}
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <FiGrid className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1.5 border-gray-100" />
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary px-4 py-2 text-sm">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden btn-ghost p-2.5 rounded-xl"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="lg:hidden border-t border-surface-border py-3 animate-slide-up">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  onClick={() => setMenuOpen(false)}
                  className="btn-ghost text-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </header>
  );
}
