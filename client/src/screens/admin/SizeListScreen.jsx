import { useState } from 'react';
import { FiPlus, FiTrash2, FiMaximize } from 'react-icons/fi';
import {
  useGetSizesQuery,
  useCreateSizeMutation,
  useDeleteSizeMutation,
} from '../../features/sizes/sizesApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

export default function SizeListScreen() {
  const { data, isLoading, isError, error } = useGetSizesQuery();
  const [createSize, { isLoading: isCreating }] = useCreateSizeMutation();
  const [deleteSize, { isLoading: isDeleting }] = useDeleteSizeMutation();

  const [newSizeName, setNewSizeName] = useState('');

  const handleCreateSize = async (e) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;
    
    try {
      await createSize({ name: newSizeName.trim() }).unwrap();
      setNewSizeName('');
      toast.success('Size created successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create size');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      try {
        await deleteSize(id).unwrap();
        toast.success('Size deleted');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete size');
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">{error?.data?.message || 'Failed to load sizes'}</Message>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title text-2xl m-0">Manage Sizes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Create Size Form */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMaximize className="text-brand-600" /> Add New Size
            </h2>
            <form onSubmit={handleCreateSize}>
              <div className="mb-4">
                <label className="label">Size Label</label>
                <input
                  type="text"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  className="input"
                  placeholder="e.g. 3XL, 40, etc."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full btn-primary bg-brand-600 hover:bg-brand-700 text-white py-3 shadow-none flex items-center justify-center gap-2"
              >
                {isCreating ? 'Adding...' : <><FiPlus className="w-5 h-5" /> Add Size</>}
              </button>
            </form>
          </div>
        </div>

        {/* Size List */}
        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size Label</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.sizes?.map((size) => (
                    <tr key={size._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{size.name}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(size._id)}
                          disabled={isDeleting}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center inline-flex"
                          title="Delete Size"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data?.sizes?.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-8 text-center text-gray-500">
                        No sizes found. Add your first size!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
