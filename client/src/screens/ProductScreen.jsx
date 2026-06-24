import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiShoppingBag, FiStar, FiChevronLeft, FiCheck,
  FiShare2, FiHeart, FiTruck, FiRefreshCw, FiShield,
} from 'react-icons/fi';
import { useGetProductByIdQuery, useCreateReviewMutation } from '../features/products/productsApiSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';

export default function ProductScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, isError, error } = useGetProductByIdQuery(id);
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [wished, setWished] = useState(false);

  if (isLoading) return <Loader text="Loading product..." />;
  if (isError) return (
    <div className="container-max px-4 py-10">
      <Message type="error">{error?.data?.message || 'Product not found'}</Message>
    </div>
  );

  const { product } = data;
  const {
    name, description, price, discountPrice, images, category,
    rating: avgRating, numReviews, reviews, countInStock, sizes,
    fabric, color, isFeatured,
  } = product;

  const displayPrice = discountPrice > 0 ? discountPrice : price;
  const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const inStock = countInStock > 0;
  const mainImage = images?.[selectedImage]?.secure_url || 'https://placehold.co/600x750/ffffff/c44ef0?text=No+Image';

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.info('Please log in to add items to your cart');
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }
    if (!selectedSize && sizes?.length > 0 && !sizes.includes('Free Size')) {
      toast.error('Please select a size');
      return;
    }
    if (qty > countInStock) {
      toast.error('Not enough stock available');
      return;
    }
    dispatch(addToCart({
      product: product._id,
      name,
      image: images?.[0]?.secure_url,
      price: displayPrice,
      qty,
      size: selectedSize || sizes?.[0] || 'Free Size',
    }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ id: product._id, rating, comment }).unwrap();
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="container-max px-4 py-8">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-600 hover:text-brand-800 transition-colors mb-6 font-medium text-sm">
        <FiChevronLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── Image Gallery ──────────────────────────────────────────────── */}
        <div>
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-white border border-gray-200 mb-3 group">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-sm">{discount}% OFF</span>
              </div>
            )}
            {isFeatured && (
              <div className="absolute top-4 right-4">
                <span className="bg-brand-600 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-sm">✨ Featured</span>
              </div>
            )}
            <button
              onClick={() => setWished(!wished)}
              className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                wished ? 'bg-red-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:text-red-500'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${wished ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i ? 'border-brand-600 shadow-sm' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.secure_url} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            <p className="text-brand-600 font-semibold text-sm mb-1 uppercase tracking-wider">{category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">{name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-brand-600 font-medium">{avgRating?.toFixed(1)} ({numReviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-4xl font-bold text-gray-900">₹{displayPrice.toLocaleString('en-IN')}</span>
              {discount > 0 && (
                <>
                  <span className="text-gray-500 line-through text-lg font-medium">₹{price.toLocaleString('en-IN')}</span>
                  <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-sm font-bold">Save ₹{(price - displayPrice).toLocaleString('en-IN')}</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 font-medium">Inclusive of all taxes. Free delivery on orders above ₹999.</p>
          </div>

          {/* Smart Inventory Tracking (Scarcity Alert) */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            {inStock ? (
              <span className="text-sm font-bold text-green-600">
                In Stock {countInStock <= 5 && <span className="text-red-500 ml-1">— Only {countInStock} items left, order soon!</span>}
              </span>
            ) : (
              <span className="text-sm font-bold text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Size Picker */}
          {sizes?.length > 0 && !sizes.includes('Free Size') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-900">Select Size</label>
                <button className="text-xs font-semibold text-brand-600 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-red-500 font-medium mt-2">⚠ Please select a size before adding to cart</p>
              )}
            </div>
          )}

          {/* Qty */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-3 block">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-xl bg-white border border-gray-300 text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all text-xl flex items-center justify-center shadow-sm"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-gray-900 text-xl">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(countInStock, q + 1))}
                disabled={!inStock}
                className="w-12 h-12 rounded-xl bg-white border border-gray-300 text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all text-xl flex items-center justify-center disabled:opacity-50 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 btn-secondary bg-white border-brand-600 text-brand-600 hover:bg-brand-50 text-base py-4 font-bold"
              id="add-to-cart-btn"
            >
              <FiShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 btn-primary bg-brand-600 hover:bg-brand-700 text-base py-4 font-bold shadow-none"
              id="buy-now-btn"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <hr className="border-gray-200 my-6" />
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Product Details</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Category', value: category },
                { label: 'Fabric', value: fabric || 'N/A' },
                { label: 'Color', value: color || 'N/A' },
                { label: 'Sizes', value: sizes?.join(', ') || 'Free Size' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-gray-900 font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: FiTruck, label: 'Free Delivery', sub: '₹999+' },
              { icon: FiRefreshCw, label: '7-Day Return', sub: 'Easy process' },
              { icon: FiShield, label: 'Secure Pay', sub: 'Razorpay' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
                <Icon className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-900 mb-0.5">{label}</p>
                <p className="text-xs text-gray-500 font-medium">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ────────────────────────────────────────────────── */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Customer Reviews</h2>

        {/* Review Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-6xl font-bold text-gray-900 mb-2">{avgRating?.toFixed(1)}</p>
            <div className="flex justify-center md:justify-start mt-2 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <FiStar key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-600 font-medium">Based on {numReviews} reviews</p>
          </div>
        </div>

        {/* Review List */}
        {reviews?.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 font-medium">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {reviews?.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-base font-bold">
                      {review.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write Review */}
        {userInfo ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar className={`w-8 h-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">Your Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="input bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 resize-none w-full"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary bg-brand-600 hover:bg-brand-700 text-white shadow-none px-8" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl font-medium">
            Please <a href="/login" className="underline font-bold">login</a> to write a review.
          </div>
        )}
      </div>
    </div>
  );
}
