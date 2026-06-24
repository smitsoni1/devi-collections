import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { useGetMyOrdersQuery } from '../features/orders/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Breadcrumb from '../components/Breadcrumb';

const statusColor = {
  pending: 'badge-warning',
  processing: 'badge-brand',
  shipped: 'badge-brand',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

export default function MyOrdersScreen() {
  const { data, isLoading, isError } = useGetMyOrdersQuery();

  if (isLoading) return <Loader text="Loading your orders..." />;
  if (isError) return <Message type="error">Failed to load orders</Message>;

  const orders = data?.orders || [];

  return (
    <div className="container-max px-4 py-8">
      <Breadcrumb pageName="My Orders" />
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <FiPackage className="w-5 h-5 text-brand-400" />
        </div>
        <h1 className="page-title text-2xl">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="section-title text-xl mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping!</p>
          <Link to="/" className="btn-primary inline-flex">
            <FiShoppingBag className="w-5 h-5" /> Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              className="card-hover block p-5 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-brand-700 text-sm font-medium">#{order._id.slice(-12).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  {order.isPaid ? (
                    <span className="badge-success text-xs">Paid</span>
                  ) : (
                    <span className="badge-warning text-xs">Pending</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`${statusColor[order.orderStatus] || 'badge'} text-xs`}>
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                  </span>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-600 mt-3 self-center" />
              </div>

              {/* Mini product preview */}
              <div className="flex gap-2 mt-4 overflow-hidden">
                {order.orderItems?.slice(0, 4).map((item) => (
                  <img
                    key={item._id}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded-lg border border-surface-border"
                  />
                ))}
                {order.orderItems?.length > 4 && (
                  <div className="w-12 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                    +{order.orderItems.length - 3}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
