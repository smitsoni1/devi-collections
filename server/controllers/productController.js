import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// ─── Helper: upload buffer to Cloudinary ────────────────────────────────────
const uploadToCloudinary = (buffer, folder = 'ecommerce/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 800, height: 1000, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ─── @desc  Get all products (paginated, filtered, sorted)
// ─── @route GET /api/products
// ─── @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  // Build query filter
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  
  if (req.query.inStock === 'true') filter.countInStock = { $gt: 0 };
  
  // Advanced Filters
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  
  if (req.query.size) {
    filter.sizes = { $in: req.query.size.split(',') };
  }
  
  if (req.query.fabric) {
    filter.fabric = { $regex: req.query.fabric, $options: 'i' };
  }
  
  if (req.query.rating) {
    filter.rating = { $gte: Number(req.query.rating) };
  }

  // Build sort
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'top-rated': { rating: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// ─── @desc  Get single product
// ─── @route GET /api/products/:id
// ─── @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// ─── @desc  Create product
// ─── @route POST /api/products
// ─── @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, discountPrice,
    category, sizes, countInStock, fabric, color, isFeatured,
  } = req.body;

  let images = [];

  // Upload images to Cloudinary if files are present
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );
    const results = await Promise.all(uploadPromises);
    images = results.map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
    }));
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    discountPrice: Number(discountPrice) || 0,
    category,
    sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [],
    countInStock: Number(countInStock) || 0,
    images,
    fabric,
    color,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    user: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// ─── @desc  Update product
// ─── @route PUT /api/products/:id
// ─── @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name, description, price, discountPrice,
    category, sizes, countInStock, fabric, color, isFeatured,
  } = req.body;

  // Handle new image uploads
  let newImages = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );
    const results = await Promise.all(uploadPromises);
    newImages = results.map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
    }));
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
  product.category = category || product.category;
  product.sizes = sizes
    ? (Array.isArray(sizes) ? sizes : sizes.split(','))
    : product.sizes;
  product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
  product.fabric = fabric || product.fabric;
  product.color = color || product.color;
  product.isFeatured = isFeatured !== undefined
    ? isFeatured === 'true' || isFeatured === true
    : product.isFeatured;

  if (newImages.length > 0) {
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// ─── @desc  Delete product
// ─── @route DELETE /api/products/:id
// ─── @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    try {
      const deletePromises = product.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete images from Cloudinary:', error.message);
    }
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ─── @desc  Create product review
// ─── @route POST /api/products/:id/reviews
// ─── @access Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// ─── @desc  Delete a product image
// ─── @route DELETE /api/products/:id/images/:imageId
// ─── @access Private/Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const image = product.images.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }

  await cloudinary.uploader.destroy(image.public_id);
  product.images = product.images.filter(
    (img) => img._id.toString() !== req.params.imageId
  );
  await product.save();

  res.json({ success: true, message: 'Image deleted', images: product.images });
});
