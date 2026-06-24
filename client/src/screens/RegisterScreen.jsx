import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useRegisterMutation } from '../features/auth/authSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    return 'strong';
  };

  const strength = passwordStrength(form.password);
  const strengthConfig = {
    weak: { color: 'bg-red-500', label: 'Weak', width: '33%' },
    medium: { color: 'bg-amber-500', label: 'Medium', width: '66%' },
    strong: { color: 'bg-emerald-500', label: 'Strong', width: '100%' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const result = await register({ name: form.name, email: form.email, password: form.password }).unwrap();
      dispatch(setCredentials(result.user));
      navigate('/');
      toast.success(`Welcome to Devi Collections, ${result.user.name.split(' ')[0]}! 🎉`);
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient mx-auto flex items-center justify-center shadow-brand-lg mb-4 animate-float">
            <span className="text-white font-display font-bold text-3xl">D</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Join thousands of happy customers</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">

          <div>
            <label htmlFor="name" className="label">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input pl-11"
                placeholder="Priya Sharma"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="label">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input pl-11"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="label">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input pl-11 pr-12"
                placeholder="Min. 6 characters"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthConfig[strength].color}`}
                    style={{ width: strengthConfig[strength].width }}
                  />
                </div>
                <p className={`text-xs mt-1 ${strengthConfig[strength].color.replace('bg-', 'text-')}`}>
                  {strengthConfig[strength].label} password
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="label">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="confirm-password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input pl-11"
                placeholder="Repeat your password"
                required
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 text-base"
            id="register-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            By registering, you agree to our <Link to="/terms" className="text-brand-400">Terms</Link> and <Link to="/privacy" className="text-brand-400">Privacy Policy</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
            Log in instead →
          </Link>
        </p>
      </div>
    </div>
  );
}
