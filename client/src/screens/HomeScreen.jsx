import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronLeft, FiChevronRight, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Loader';
import Message from '../components/Message';
import CategorySlider from '../components/CategorySlider';
import HeroCarousel from '../components/HeroCarousel';
import PromoBanners from '../components/PromoBanners';
import { useGetProductsQuery } from '../features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useGetSizesQuery } from '../features/sizes/sizesApiSlice';

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

  const isHomeView = !category && !search && !minPrice && !maxPrice && !size && !fabric && !rating;

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
    ...(isHomeView && { isFeatured: true }),
  };

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = ['All', ...(categoriesData?.categories?.map(c => c.name) || [])];
  const { data: sizesData } = useGetSizesQuery();
  const sizes = sizesData?.sizes?.map(s => s.name) || [];

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

  if (isHomeView) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Full Width Hero Carousel */}
        <HeroCarousel />

        <div className="container-max px-4">
          {/* Shop by Category Slider */}
          <CategorySlider />

          {/* Promotional Banners */}
          <PromoBanners />

          {/* Trending Products (Featured) */}
          <section className="my-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Trending Now</h2>
                <p className="text-gray-500">Handpicked premium collection just for you</p>
              </div>
              <Link to="/?sort=top-rated" className="hidden sm:inline-flex text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                View All →
              </Link>
            </div>

            {isLoading || isFetching ? (
              <SkeletonGrid count={8} />
            ) : isError ? (
              <Message variant="danger">{error?.data?.message || 'Failed to load products'}</Message>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {data?.products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center sm:hidden">
              <Link to="/?sort=top-rated" className="btn-secondary inline-block">
                View All Products
              </Link>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-gray-200">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₹999' },
              { icon: FiRefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout via Razorpay' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center justify-center gap-4 text-center md:text-left bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* ── Shop Header ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 mb-6">
        <div className="container-max text-center">
          <h1 className="page-title text-3xl md:text-5xl mb-4 text-[#111111] capitalize">
            {search ? `Results for "${search}"` : `Shop ${category || 'All Products'}`}
          </h1>
          
          <form
            onSubmit={handleSearch}
            className="flex items-center max-w-2xl mx-auto gap-3 mt-8"
          >
            <div className="flex-1 flex items-center gap-3 input bg-white border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-sm">
              <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search Kurtis, Sarees, Lehengas..."
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-500"
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-3 rounded-xl bg-gray-900 hover:bg-black text-white flex-shrink-0 shadow-none">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Shop Section with Sidebar ───────────────────────────────────── */}
      <section className="container-max px-4 pb-16 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden w-full flex items-center justify-center gap-2 btn-secondary bg-white border-gray-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* ── Sidebar Filters ── */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md">
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Category</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="category"
                        checked={category === cat || (cat === 'All' && !category)}
                        onChange={() => setCategory(cat === 'All' ? '' : cat)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-brand-600 checked:bg-brand-600 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-brand-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-5" />

            {/* Price */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Price Range</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <hr className="border-gray-100 my-5" />

            {/* Size */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? '' : s)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition-all font-medium ${size === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-5" />

            {/* Rating */}
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Avg. Rating</h4>
              <div className="space-y-3">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="rating"
                        checked={Number(rating) === r}
                        onChange={() => setRating(r.toString())}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-brand-600 checked:bg-brand-600 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-700 flex items-center gap-1 group-hover:text-brand-600 transition-colors">
                      {'★'.repeat(r)}
                      <span className="text-gray-300">{'★'.repeat(5-r)}</span>
                      <span className="text-gray-500 text-xs ml-1">& Up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ── Main Product Grid ── */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            {data && (
              <p className="text-sm text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{data.products?.length || 0}</span> of{' '}
                <span className="font-bold text-gray-900">{data.total || 0}</span> results
              </p>
            )}

            <div className="relative flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 font-medium py-2 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer min-w-[160px] transition-all"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading || isFetching ? (
            <SkeletonGrid count={9} />
          ) : isError ? (
            <Message variant="danger">{error?.data?.message || 'Failed to load products'}</Message>
          ) : data?.products?.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl text-center py-24 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No matches found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Try adjusting your filters, price range, or search term to find what you're looking for.</p>
              <button onClick={clearFilters} className="btn-primary bg-gray-900 hover:bg-black text-white shadow-none px-8">Clear All Filters</button>
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
                <div className="flex items-center justify-center gap-2 mt-12 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-fit mx-auto">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          p === page
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-transparent text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
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
