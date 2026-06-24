import { useState } from 'react';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/categories/categoriesApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

export default function CategoryListScreen() {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      await createCategory({ name: newCategoryName.trim() }).unwrap();
      setNewCategoryName('');
      toast.success('Category created successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">{error?.data?.message || 'Failed to load categories'}</Message>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title text-2xl m-0">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Create Category Form */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiTag className="text-brand-600" /> Add New Category
            </h2>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label className="label">Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="input"
                  placeholder="e.g. Chaniya Choli"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full btn-primary bg-brand-600 hover:bg-brand-700 text-white py-3 shadow-none flex items-center justify-center gap-2"
              >
                {isCreating ? 'Adding...' : <><FiPlus className="w-5 h-5" /> Add Category</>}
              </button>
            </form>
          </div>
        </div>

        {/* Category List */}
        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.categories?.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{category.name}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={isDeleting}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center inline-flex"
                          title="Delete Category"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data?.categories?.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-8 text-center text-gray-500">
                        No categories found. Add your first category!
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
