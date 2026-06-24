import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../features/products/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

export default function ProductListScreen() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useGetProductsQuery({ page, pageSize: 15, search });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also remove images from Cloudinary.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="page-title text-2xl">Products</h1>
        <Link to="/admin/products/new" className="btn-primary" id="add-product-btn">
          <FiPlus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input pl-11 py-2.5"
          placeholder="Search products..."
        />
      </div>

      {isLoading ? <Loader /> : isError ? (
        <Message type="error">Failed to load products</Message>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-elevated">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Category</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Price</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Stock</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Rating</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data?.products?.map((product) => (
                    <tr key={product._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.secure_url || 'https://placehold.co/40x50/1a1228/c44ef0?text=?'}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-white text-sm line-clamp-1 max-w-40">{product.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{product._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-brand text-xs">{product.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-white">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                          {product.discountPrice > 0 && (
                            <p className="text-xs price-original">₹{product.price.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {product.countInStock === 0 && <FiAlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                          {product.countInStock > 0 && product.countInStock < 5 && <FiAlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                          <span className={`text-sm font-medium ${product.countInStock === 0 ? 'text-red-400' : product.countInStock < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {product.countInStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{product.rating?.toFixed(1)} ⭐ ({product.numReviews})</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/20 transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                            disabled={deleting}
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
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
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-brand-gradient text-white' : 'bg-surface-card border border-surface-border text-gray-400 hover:border-brand-600'}`}
                >
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
