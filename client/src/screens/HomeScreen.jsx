import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../features/products/productsApiSlice';

const CATEGORIES = ['All', 'Kurti', 'Saree', 'Lehenga', 'Salwar Suit', 'Dupatta', 'Dress Material'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const FABRICS = ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Crepe', 'Rayon'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'top-rated', label: 'Top Rated' },
];

export default function HomeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [fabric, setFabric] = useState(searchParams.get('fabric') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = {
    page,
    pageSize: 12,
    sort,
    ...(category && { category }),
    ...(search && { search }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(size && { size }),
    ...(fabric && { fabric }),
    ...(rating && { rating }),
  };

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(queryParams);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (sort !== 'newest') params.sort = sort;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (size) params.size = size;
    if (fabric) params.fabric = fabric;
    if (rating) params.rating = rating;
    setSearchParams(params);
    setPage(1);
  }, [category, sort, search, minPrice, maxPrice, size, fabric, rating]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value.trim();
    setSearch(val);
  };

  const clearFilters = () => {
    setCategory('');
    setSort('newest');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSize('');
    setFabric('');
    setRating('');
    setSearchParams({});
    setPage(1);
  };

  const hasFilters = category || sort !== 'newest' || search || minPrice || maxPrice || size || fabric || rating;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 mb-6">
        <div className="container-max text-center">
          <h1 className="page-title text-3xl md:text-5xl mb-4 text-[#111111]">
            Discover Premium <span className="text-brand-600">Indian Fashion</span>
          </h1>
          
          <form
            onSubmit={handleSearch}
            className="flex items-center max-w-2xl mx-auto gap-3 mt-8"
          >
            <div className="flex-1 flex items-center gap-3 input bg-white border border-gray-300 rounded-xl px-4 py-3">
              <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search Kurtis, Sarees, Lehengas..."
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-500"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex-shrink-0 shadow-none">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Shop Section with Sidebar ───────────────────────────────────── */}
      <section className="container-max px-4 pb-16 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden w-full flex items-center justify-center gap-2 btn-secondary bg-white border-gray-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* ── Sidebar Filters ── */}
        <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === cat || (cat === 'All' && !category)}
                      onChange={() => setCategory(cat === 'All' ? '' : cat)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Price */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Size */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? '' : s)}
                    className={`px-3 py-1 text-xs border rounded-lg transition-colors ${size === s ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Rating */}
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">Average Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={Number(rating) === r}
                      onChange={() => setRating(r.toString())}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center">
                      {'★'.repeat(r)}{'☆'.repeat(5-r)} & Up
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ── Main Product Grid ── */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            {data && (
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{data.products?.length || 0}</span> of{' '}
                <span className="font-semibold text-gray-900">{data.total || 0}</span> results
                {search && <span> for "<span className="text-brand-600 font-medium">{search}</span>"</span>}
              </p>
            )}

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Grid */}
          {isLoading || isFetching ? (
            <SkeletonGrid count={9} />
          ) : isError ? (
            <Message variant="danger">{error?.data?.message || 'Failed to load products'}</Message>
          ) : data?.products?.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl text-center py-20">
              <div className="text-5xl mb-4 text-gray-300">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
              <button onClick={clearFilters} className="btn-secondary bg-white text-gray-700">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 bg-white"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-brand-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:border-brand-600 hover:text-brand-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
