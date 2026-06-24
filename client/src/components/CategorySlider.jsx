import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useRef, useEffect } from 'react';

export default function CategorySlider() {
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ pageSize: 100 });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const scrollRef = useRef(null);

  // Group categories with their first product image
  const categoriesWithImages = categoriesData?.categories?.map((cat) => {
    const product = productsData?.products?.find((p) => p.category === cat.name);
    return {
      name: cat.name,
      image: product?.images?.[0]?.secure_url || 'https://placehold.co/400x500/1a1228/c44ef0?text=' + cat.name,
    };
  }).filter(c => c.image) || [];

  // Auto-scroll logic
  useEffect(() => {
    if (categoriesWithImages.length <= 1 || !scrollRef.current) return;
    
    let scrollAmount = 0;
    const step = 2; // px per tick
    
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += step;
        scrollAmount += step;
        
        // Reset to beginning if reached the end (approx)
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 5) {
          scrollRef.current.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [categoriesWithImages.length]);

  if (productsLoading || categoriesLoading || categoriesWithImages.length === 0) return null;

  return (
    <div className="w-full py-8 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-6 px-4 md:px-0">
        Shop by Category
      </h2>
      
      {/* Hide scrollbar but allow scrolling */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-4 md:px-0"
        style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {categoriesWithImages.map((cat, index) => (
          <Link 
            key={index} 
            to={`/?category=${cat.name}`}
            className="flex-shrink-0 w-[120px] md:w-[160px] snap-start group"
          >
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <p className="text-center font-medium text-gray-900 text-sm md:text-base group-hover:text-brand-600 transition-colors">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
