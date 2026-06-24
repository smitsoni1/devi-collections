import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLoginMutation } from '../features/auth/authSlice';
import { setCredentials } from '../features/auth/authSlice';
import { setCartItems } from '../features/cart/cartSlice';
import Breadcrumb from '../components/Breadcrumb';
import { toast } from 'react-toastify';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result.user));
      if (result.user.cart && result.user.cart.length > 0) {
        dispatch(setCartItems(result.user.cart));
      }
      if (result.user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}! 🎉`);
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <Breadcrumb pageName="Sign In" />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient mx-auto flex items-center justify-center shadow-brand-lg mb-4 animate-float">
            <span className="text-white font-display font-bold text-3xl">D</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
          <p className="text-gray-500 text-sm">Sign in to your Devi Collections account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">

          <div>
            <label htmlFor="email" className="label">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="label mb-0">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11 pr-12"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 text-base mt-2"
            id="login-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="p-3 rounded-xl bg-brand-50 border border-brand-200">
            <p className="text-xs text-brand-700 font-medium mb-1.5">🔑 Demo Credentials</p>
            <button
              type="button"
              onClick={() => { setEmail('admin@deviCollections.com'); setPassword('admin123456'); }}
              className="text-xs text-gray-600 hover:text-brand-700 transition-colors"
            >
              Admin: admin@deviCollections.com / admin123456
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
            Create one for free →
          </Link>
        </p>
      </div>
    </div>
  );
}
