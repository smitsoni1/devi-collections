import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../../features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { useGetSizesQuery } from '../../features/sizes/sizesApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

export default function ProductEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProduct = !id || id === 'new';

  const { data, isLoading } = useGetProductByIdQuery(id, { skip: isNewProduct });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: sizesData, isLoading: sizesLoading } = useGetSizesQuery();

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', sizes: [], countInStock: '', fabric: '', color: '',
    isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (data?.product && !isNewProduct) {
      const p = data.product;
      setForm({
        name: p.name || '',
        description: p.description || '',
        price: p.price || '',
        discountPrice: p.discountPrice || '',
        category: p.category || '',
        sizes: p.sizes || [],
        countInStock: p.countInStock ?? '',
        fabric: p.fabric || '',
        color: p.color || '',
        isFeatured: p.isFeatured || false,
      });
      setExistingImages(p.images || []);
    }
  }, [data]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'sizes') {
        value.forEach((s) => formData.append('sizes', s));
      } else {
        formData.append(key, value);
      }
    });
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      if (isNewProduct) {
        await createProduct(formData).unwrap();
        toast.success('Product created successfully!');
      } else {
        await updateProduct({ id, formData }).unwrap();
        toast.success('Product updated!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  if (isLoading && !isNewProduct) return <Loader />;

  const saving = creating || updating;

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm">
        <FiArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <h1 className="page-title text-2xl mb-8">
        {isNewProduct ? 'Add New Product' : 'Edit Product'}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 border-b border-surface-border pb-3">Basic Information</h2>

            <div>
              <label className="label">Product Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input" placeholder="Floral Cotton Kurti" required />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5} className="input resize-none"
                placeholder="Describe the product, fabric, occasion, care instructions..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Original Price (₹) *</label>
                <input type="number" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input" placeholder="999" min="0" required />
              </div>
              <div>
                <label className="label">Sale Price (₹) <span className="text-gray-500 text-xs">(optional)</span></label>
                <input type="number" value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="input" placeholder="799" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Stock Qty *</label>
                <input type="number" value={form.countInStock}
                  onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
                  className="input" placeholder="50" min="0" required />
              </div>
              <div>
                <label className="label">Fabric</label>
                <input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                  className="input" placeholder="Cotton" />
              </div>
              <div>
                <label className="label">Color</label>
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="input" placeholder="Coral Pink" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label">Category *</label>
              <div className="flex flex-wrap gap-2">
                {categoriesLoading ? (
                  <Loader text="" />
                ) : categoriesData?.categories?.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.name })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      form.category === cat.name
                        ? 'border-brand-500 bg-brand-950 text-brand-300'
                        : 'border-surface-border text-gray-500 hover:border-brand-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="label">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizesLoading ? (
                  <Loader text="" />
                ) : sizesData?.sizes?.map((sz) => (
                  <button
                    key={sz._id}
                    type="button"
                    onClick={() => toggleSize(sz.name)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.sizes.includes(sz.name)
                        ? 'border-brand-500 bg-brand-950 text-brand-300'
                        : 'border-surface-border text-gray-500 hover:border-brand-700'
                    }`}
                  >
                    {sz.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${form.isFeatured ? 'bg-brand-500' : 'bg-surface-elevated border border-surface-border'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.isFeatured ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <label className="text-sm text-gray-700 cursor-pointer" onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}>
                Featured Product <span className="text-xs text-gray-500">(shown on homepage)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 border-b border-surface-border pb-3 mb-4">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Current Images</p>
                <div className="grid grid-cols-2 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden">
                      <img src={img.secure_url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new images */}
            <label
              htmlFor="images-upload"
              className="block border-2 border-dashed border-surface-border rounded-xl p-6 text-center cursor-pointer hover:border-brand-500 transition-colors group"
            >
              <FiUpload className="w-8 h-8 text-gray-500 group-hover:text-brand-400 transition-colors mx-auto mb-2" />
              <p className="text-sm text-gray-500 group-hover:text-gray-700">
                {imagePreviews.length > 0 ? `${imagePreviews.length} new image(s) selected` : 'Click to upload images'}
              </p>
              <p className="text-xs text-gray-600 mt-1">JPEG, PNG, WebP · Max 5MB each · Up to 5 files</p>
              <input
                id="images-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreviews((p) => p.filter((_, idx) => idx !== i));
                        setImageFiles((f) => f.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary py-4 text-base"
            id="save-product-btn"
          >
            {saving ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isNewProduct ? 'Creating...' : 'Saving...'}
              </span>
            ) : (
              <><FiSave className="w-5 h-5" /> {isNewProduct ? 'Create Product' : 'Save Changes'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
