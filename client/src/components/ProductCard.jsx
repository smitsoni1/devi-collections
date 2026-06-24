import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingBag, FiStar, FiHeart } from 'react-icons/fi';
import { addToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [wished, setWished] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const {
    _id,
    name,
    price,
    discountPrice,
    images,
    category,
    rating,
    numReviews,
    countInStock,
    sizes,
  } = product;

  const mainImage = images?.[0]?.secure_url || 'https://placehold.co/400x500/1a1228/c44ef0?text=No+Image';
  const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const displayPrice = discountPrice > 0 ? discountPrice : price;
  const inStock = countInStock > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.info('Please log in to add items to your cart');
      navigate(`/login?redirect=/product/${_id}`);
      return;
    }
    if (!inStock) return;
    const defaultSize = sizes?.length === 1 ? sizes[0] : sizes?.[0] || 'Free Size';
    dispatch(addToCart({
      product: _id,
      name,
      image: mainImage,
      price: displayPrice,
      qty: 1,
      size: defaultSize,
    }));
    toast.success(`${name.slice(0, 20)}... added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  return (
    <Link to={`/product/${_id}`} className="group block card-hover overflow-hidden animate-fade-in">

      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-surface-elevated">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={mainImage}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge-gold text-xs">{discount}% OFF</span>
          )}
          {!inStock && (
            <span className="badge-danger text-xs">Out of Stock</span>
          )}
          {inStock && countInStock <= 5 && (
            <span className="badge-warning text-xs">Only {countInStock} left</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
            wished
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-surface/80 backdrop-blur-sm text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Add to wishlist"
        >
          <FiHeart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="w-full btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingBag className="w-4 h-4" />
            {inStock ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium mb-1">{category}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors mb-2">
          {name}
        </h3>

        {/* Rating */}
        {numReviews > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-bold text-base">₹{displayPrice.toLocaleString('en-IN')}</span>
          {discount > 0 && (
            <span className="price-original">₹{price.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Sizes preview */}
        {sizes?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {sizes.slice(0, 5).map((size) => (
              <span key={size} className="text-xs text-gray-600 border border-gray-300 px-1.5 py-0.5 rounded">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
