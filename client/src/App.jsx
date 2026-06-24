import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSyncCartMutation } from './features/auth/authSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';
import { PageLoader } from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded screens
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const CheckoutWizardScreen = lazy(() => import('./screens/CheckoutWizardScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const MyOrdersScreen = lazy(() => import('./screens/MyOrdersScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

// Admin screens (lazy)
const AdminLayout = lazy(() => import('./screens/admin/AdminLayout'));
const DashboardScreen = lazy(() => import('./screens/admin/DashboardScreen'));
const ProductListScreen = lazy(() => import('./screens/admin/ProductListScreen'));
const ProductEditScreen = lazy(() => import('./screens/admin/ProductEditScreen'));
const OrderListScreen = lazy(() => import('./screens/admin/OrderListScreen'));
const UserListScreen = lazy(() => import('./screens/admin/UserListScreen'));

export default function App() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    if (userInfo) {
      syncCart({ cartItems });
    }
  }, [cartItems, userInfo, syncCart]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Private Routes (logged-in users) */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<CheckoutWizardScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orders" element={<MyOrdersScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardScreen />} />
                <Route path="products" element={<ProductListScreen />} />
                <Route path="products/new" element={<ProductEditScreen />} />
                <Route path="products/:id/edit" element={<ProductEditScreen />} />
                <Route path="orders" element={<OrderListScreen />} />
                <Route path="users" element={<UserListScreen />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <p className="text-8xl font-display font-bold text-gradient mb-4">404</p>
                <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6">This page doesn't exist. Let's take you back to shopping.</p>
                <a href="/" className="btn-primary">← Back to Shop</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
