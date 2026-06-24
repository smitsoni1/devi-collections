import { Link } from 'react-router-dom';
import {
  FiDollarSign, FiPackage, FiShoppingBag, FiUsers,
  FiAlertTriangle, FiTrendingUp, FiArrowRight,
} from 'react-icons/fi';
import { useGetDashboardMetricsQuery } from '../../features/users/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

export default function DashboardScreen() {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();

  if (isLoading) return <Loader text="Loading dashboard..." />;
  if (isError) return <Message type="error">Failed to load dashboard metrics</Message>;

  const { metrics } = data;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
      icon: FiDollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders,
      sub: `${metrics.paidOrders} paid`,
      icon: FiPackage,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      label: 'Total Products',
      value: metrics.totalProducts,
      icon: FiShoppingBag,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10 border-gold-500/20',
    },
    {
      label: 'Total Customers',
      value: metrics.totalUsers,
      icon: FiUsers,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title text-2xl">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className={`card p-5 border ${bg}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Sales Chart (simple bar representation) */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiTrendingUp className="w-5 h-5 text-brand-400" />
            <h2 className="font-semibold text-white">Monthly Revenue</h2>
          </div>
          {metrics.monthlySales?.length > 0 ? (
            <div className="space-y-3">
              {metrics.monthlySales.map((month) => {
                const maxRevenue = Math.max(...metrics.monthlySales.map((m) => m.revenue));
                const percent = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                const monthName = new Date(month._id.year, month._id.month - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
                return (
                  <div key={`${month._id.year}-${month._id.month}`}>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{monthName}</span>
                      <span className="text-white">₹{month.revenue.toLocaleString('en-IN')} ({month.orders} orders)</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-gradient rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-white">Low Stock Alerts</h2>
            </div>
            <Link to="/admin/products" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View All <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {metrics.lowStockProducts?.length === 0 ? (
            <p className="text-emerald-400 text-sm">✓ All products are well-stocked!</p>
          ) : (
            <div className="space-y-3">
              {metrics.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-40">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${product.countInStock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                      {product.countInStock === 0 ? 'Out of Stock' : `${product.countInStock} left`}
                    </span>
                    <Link to={`/admin/products/${product._id}/edit`} className="text-xs text-brand-400 hover:text-brand-300">
                      Update →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View All <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {metrics.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Order</th>
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Customer</th>
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Date</th>
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Amount</th>
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Status</th>
                    <th className="text-left pb-3 text-xs text-gray-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 font-mono text-brand-300 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="py-3 text-gray-300">{order.user?.name}</td>
                      <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 text-white font-medium">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        {order.isPaid
                          ? <span className="badge-success text-xs">Paid</span>
                          : <span className="badge-warning text-xs">Pending</span>
                        }
                      </td>
                      <td className="py-3">
                        <Link to={`/order/${order._id}`} className="text-xs text-brand-400 hover:text-brand-300">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
