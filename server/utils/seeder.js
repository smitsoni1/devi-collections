import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

dotenv.config();
connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@deviCollections.com',
    password: 'admin123456',
    roles: ['customer', 'admin'],
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'customer123',
    roles: ['customer'],
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(sampleUsers);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      {
        name: 'Floral Printed Cotton Kurti',
        description:
          'Beautiful hand-block printed cotton Kurti with intricate floral patterns. Perfect for daily wear and casual outings. Breathable fabric ideal for Indian summers.',
        price: 649,
        discountPrice: 499,
        category: 'Kurti',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        countInStock: 45,
        fabric: 'Cotton',
        color: 'Coral Pink',
        isFeatured: true,
        images: [
          {
            public_id: 'ecommerce/sample/kurti-1',
            secure_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4ab3?w=800',
          },
        ],
        rating: 4.5,
        numReviews: 12,
        user: adminUser,
      },
      {
        name: 'Banarasi Silk Saree',
        description:
          'Exquisite Banarasi silk saree with zari work and traditional motifs. Comes with a matching blouse piece. A timeless classic for weddings and festivals.',
        price: 3499,
        discountPrice: 2999,
        category: 'Saree',
        sizes: ['Free Size'],
        countInStock: 15,
        fabric: 'Banarasi Silk',
        color: 'Royal Blue',
        isFeatured: true,
        images: [
          {
            public_id: 'ecommerce/sample/saree-1',
            secure_url: 'https://images.unsplash.com/photo-1610189020573-4e0e0f2ea024?w=800',
          },
        ],
        rating: 4.8,
        numReviews: 8,
        user: adminUser,
      },
      {
        name: 'Embroidered Georgette Lehenga',
        description:
          'Stunning semi-stitched lehenga with heavy embroidery and mirror work. Includes lehenga skirt, blouse piece, and dupatta. Perfect for Navratri and festive occasions.',
        price: 4999,
        discountPrice: 4199,
        category: 'Lehenga',
        sizes: ['S', 'M', 'L', 'XL'],
        countInStock: 8,
        fabric: 'Georgette',
        color: 'Emerald Green',
        isFeatured: true,
        images: [
          {
            public_id: 'ecommerce/sample/lehenga-1',
            secure_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          },
        ],
        rating: 4.7,
        numReviews: 5,
        user: adminUser,
      },
      {
        name: 'Chanderi Salwar Suit Set',
        description:
          'Elegant 3-piece Chanderi silk salwar suit with delicate thread embroidery. Includes kurta, bottom, and dupatta. Lightweight and perfect for office wear.',
        price: 1899,
        discountPrice: 1599,
        category: 'Salwar Suit',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        countInStock: 30,
        fabric: 'Chanderi Silk',
        color: 'Mint Green',
        isFeatured: false,
        images: [
          {
            public_id: 'ecommerce/sample/salwar-1',
            secure_url: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=800',
          },
        ],
        rating: 4.3,
        numReviews: 18,
        user: adminUser,
      },
      {
        name: 'Chiffon Bandhani Dupatta',
        description:
          'Vibrant tie-dye Bandhani dupatta in pure chiffon. Hand-crafted by artisans from Rajasthan. Versatile accessory to pair with any ethnic outfit.',
        price: 599,
        discountPrice: 0,
        category: 'Dupatta',
        sizes: ['Free Size'],
        countInStock: 3,
        fabric: 'Chiffon',
        color: 'Sunset Orange',
        isFeatured: false,
        images: [
          {
            public_id: 'ecommerce/sample/dupatta-1',
            secure_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
          },
        ],
        rating: 4.6,
        numReviews: 9,
        user: adminUser,
      },
      {
        name: 'Designer Anarkali Kurti',
        description:
          'Flared Anarkali kurti with intricate resham embroidery and sequin detailing. Floor-length design perfect for parties and festive celebrations.',
        price: 1299,
        discountPrice: 999,
        category: 'Kurti',
        sizes: ['S', 'M', 'L', 'XL'],
        countInStock: 20,
        fabric: 'Net + Inner Lining',
        color: 'Maroon Gold',
        isFeatured: true,
        images: [
          {
            public_id: 'ecommerce/sample/kurti-2',
            secure_url: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',
          },
        ],
        rating: 4.4,
        numReviews: 22,
        user: adminUser,
      },
    ];

    const productsWithSlugs = sampleProducts.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 5)
    }));
    await Product.insertMany(productsWithSlugs);

    console.log('✅ Data Imported Successfully!');
    console.log('📧 Admin Email: admin@deviCollections.com');
    console.log('🔑 Admin Password: admin123456');
    process.exit();
  } catch (error) {
    console.error(`❌ Import Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ All Data Destroyed');
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
