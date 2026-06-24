import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productsApiSlice';
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductSlider() {
  const { data, isLoading, isError } = useGetProductsQuery({ pageSize: 10, isFeatured: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = data?.products?.filter(p => p.isFeatured) || [];

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (isLoading || isError || products.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden mb-8 group">
      {/* Slides */}
      <div 
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {products.map((product) => (
          <div key={product._id} className="min-w-full h-full relative">
            <img 
              src={product.images?.[0]?.secure_url} 
              alt={product.name} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
              <span className="badge-brand mb-3 inline-block">Featured</span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 md:mb-4 max-w-3xl leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl md:text-2xl font-bold text-white">
                  ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <Link to={`/product/${product._id}`} className="btn-primary inline-flex">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {products.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {products.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-brand-400' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
