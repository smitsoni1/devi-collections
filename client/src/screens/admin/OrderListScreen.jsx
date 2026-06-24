import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiTruck, FiExternalLink } from 'react-icons/fi';
import { useGetAllOrdersQuery, useDeliverOrderMutation } from '../../features/orders/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const STATUS_FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderListScreen() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, isError } = useGetAllOrdersQuery({ page, pageSize: 20, status: statusFilter || undefined });
  const [deliverOrder, { isLoading: delivering }] = useDeliverOrderMutation();

  const handleDeliver = async (id) => {
    const tracking = prompt('Enter tracking number (optional):');
    try {
      await deliverOrder({ id, trackingNumber: tracking || '' }).unwrap();
      toast.success('Order marked as delivered');
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="page-title text-2xl">Orders</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiFilter className="w-4 h-4" />
          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s === 'all' ? '' : s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  (s === 'all' && !statusFilter) || statusFilter === s
                    ? 'bg-brand-gradient text-white'
                    : 'bg-surface-card border border-surface-border text-gray-400 hover:border-brand-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? <Loader /> : isError ? (
        <Message type="error">Failed to load orders</Message>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-elevated">
                    {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data?.orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-brand-300 text-xs">#{order._id.slice(-10).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{order.orderItems?.length}</td>
                      <td className="px-4 py-3 font-semibold text-white">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        {order.isPaid
                          ? <span className="badge-success text-xs">Paid</span>
                          : <span className="badge-warning text-xs">Pending</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs capitalize ${
                          order.orderStatus === 'delivered' ? 'badge-success'
                            : order.orderStatus === 'cancelled' ? 'badge-danger'
                            : 'badge-brand'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            target="_blank"
                            className="w-7 h-7 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center text-gray-400 hover:text-brand-300 hover:border-brand-500 transition-colors"
                          >
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {order.isPaid && !order.isDelivered && (
                            <button
                              onClick={() => handleDeliver(order._id)}
                              disabled={delivering}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs"
                            >
                              <FiTruck className="w-3 h-3" /> Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-brand-gradient text-white' : 'bg-surface-card border border-surface-border text-gray-400 hover:border-brand-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
