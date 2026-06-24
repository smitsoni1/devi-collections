import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiBarChart2, FiChevronRight, FiMenu, FiX,
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FiBarChart2 },
  { label: 'Products', path: '/admin/products', icon: FiShoppingBag },
  { label: 'Orders', path: '/admin/orders', icon: FiPackage },
  { label: 'Customers', path: '/admin/users', icon: FiUsers },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-65px)]">

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } bg-surface-card border-r border-surface-border flex flex-col pt-6 pb-4`}>

        <div className="px-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-white text-lg">Admin Panel</p>
              <p className="text-xs text-brand-300">Devi Collections</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-2">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="px-3 flex-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'text-gray-400 hover:bg-surface-elevated hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {active && <FiChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pt-4 border-t border-surface-border">
          <Link to="/" className="btn-ghost text-xs w-full justify-start gap-2">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-surface-border">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2">
            <FiMenu className="w-5 h-5" />
          </button>
          <p className="font-semibold text-white text-sm">Admin Panel</p>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
