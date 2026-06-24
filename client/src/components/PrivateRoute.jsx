import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ─── Requires authenticated user ─────────────────────────────────────────────
export function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

// ─── Requires admin role ──────────────────────────────────────────────────────
export function AdminRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return <Navigate to="/login" replace />;
  if (!userInfo.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
