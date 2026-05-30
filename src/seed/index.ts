import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Brand } from '../models/Brand';
import { User } from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Ekanshi';

const categoryData = [
  { name: 'Makeup', icon: '💄', slug: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', discount: 'Up To 50% Off', sortOrder: 1 },
  { name: 'Skincare', icon: '✨', slug: 'skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', discount: 'Up To 40% Off', sortOrder: 2 },
  { name: 'Haircare', icon: '💇', slug: 'haircare', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop', discount: 'Up To 50% Off', sortOrder: 3 },
  { name: 'Bath & Body', icon: '🛁', slug: 'bath-body', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400&h=400&fit=crop', discount: 'Up To 50% Off', sortOrder: 4 },
  { name: 'Fragrance', icon: '🌸', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', discount: 'Up To 30% Off', sortOrder: 5 },
  { name: 'Appliances', icon: '🔌', slug: 'appliances', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop', discount: 'Up To 60% Off', sortOrder: 6 },
  { name: 'Natural', icon: '🌿', slug: 'natural', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop', discount: 'Up To 40% Off', sortOrder: 7 },
  { name: 'Mom & Baby', icon: '👶', slug: 'mom-baby', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', discount: 'Up To 35% Off', sortOrder: 8 },
];

const brandData = [
  { name: 'Maybelline', logo: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200&h=100&fit=crop', slug: 'maybelline', sortOrder: 1 },
  { name: "L'Oréal", logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=100&fit=crop', slug: 'loreal', sortOrder: 2 },
  { name: 'MAC', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=100&fit=crop', slug: 'mac', sortOrder: 3 },
  { name: 'Clinique', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=100&fit=crop', slug: 'clinique', sortOrder: 4 },
  { name: 'Lakme', logo: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=100&fit=crop', slug: 'lakme', sortOrder: 5 },
  { name: 'Nykaa', logo: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=100&fit=crop', slug: 'nykaa', sortOrder: 6 },
  { name: 'The Ordinary', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=100&fit=crop', slug: 'the-ordinary', sortOrder: 7 },
  { name: 'Charlotte Tilbury', logo: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=200&h=100&fit=crop', slug: 'charlotte-tilbury', sortOrder: 8 },
];

const productData = [
  { name: 'Fit Me Matte Foundation', brand: 'Maybelline', price: 499, originalPrice: 699, discount: 29, rating: 4.3, reviews: 12453, image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=500&fit=crop', category: 'makeup', subcategory: 'foundation', description: 'Lightweight, oil-free foundation that mattifies and refines pores for a natural, seamless finish.', isBestseller: true, isNewProduct: false, tags: ['bestseller', 'matte'], stock: 150 },
  { name: 'Hyaluronic Acid Serum', brand: 'The Ordinary', price: 590, originalPrice: 790, discount: 25, rating: 4.5, reviews: 8932, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop', category: 'skincare', subcategory: 'serum', description: 'Multi-depth hydration serum with 2% HA for plump, dewy skin.', isBestseller: true, isNewProduct: false, tags: ['hydrating', 'serum'], stock: 200 },
  { name: 'Argan Oil Hair Serum', brand: "L'Oréal", price: 399, originalPrice: 599, discount: 33, rating: 4.2, reviews: 5621, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=500&fit=crop', category: 'haircare', subcategory: 'serum', description: 'Nourishing argan oil serum that tames frizz and adds brilliant shine.', isBestseller: false, isNewProduct: false, tags: ['anti-frizz', 'shine'], stock: 80 },
  { name: 'Matte Lipstick Rouge', brand: 'MAC', price: 1750, originalPrice: 1950, discount: 10, rating: 4.7, reviews: 15234, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=500&fit=crop', category: 'makeup', subcategory: 'lipstick', description: 'Iconic matte lipstick in bold rouge. Long-wearing, highly pigmented formula.', isBestseller: true, isNewProduct: false, tags: ['matte', 'iconic'], stock: 120 },
  { name: 'Vitamin C Brightening Cream', brand: 'Clinique', price: 2100, originalPrice: 2800, discount: 25, rating: 4.4, reviews: 3456, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop', category: 'skincare', subcategory: 'moisturizer', description: 'Potent vitamin C formula that brightens dull skin and evens out tone.', isBestseller: false, isNewProduct: true, tags: ['brightening', 'vitamin-c'], stock: 60 },
  { name: 'Keratin Smooth Shampoo', brand: "L'Oréal", price: 350, originalPrice: 450, discount: 22, rating: 4.1, reviews: 7821, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=500&fit=crop', category: 'haircare', subcategory: 'shampoo', description: 'Keratin-infused shampoo for silky smooth, frizz-free hair up to 72 hours.', isBestseller: false, isNewProduct: false, tags: ['keratin', 'smooth'], stock: 90 },
  { name: 'Rose Body Wash', brand: 'Lakme', price: 299, originalPrice: 399, discount: 25, rating: 4.0, reviews: 2345, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400&h=500&fit=crop', category: 'bath-body', subcategory: 'body-wash', description: 'Luxurious rose-scented body wash that gently cleanses and moisturizes.', isBestseller: false, isNewProduct: false, tags: ['rose', 'moisturizing'], stock: 110 },
  { name: 'Kajal Intense Black', brand: 'Lakme', price: 199, originalPrice: 299, discount: 33, rating: 4.3, reviews: 18923, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=500&fit=crop', category: 'makeup', subcategory: 'eyes', description: 'Smudge-proof, waterproof kajal for intense, dramatic eyes all day long.', isBestseller: true, isNewProduct: false, tags: ['waterproof', 'intense'], stock: 300 },
  { name: 'Niacinamide 10% Serum', brand: 'The Ordinary', price: 690, originalPrice: 890, discount: 22, rating: 4.6, reviews: 11234, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop', category: 'skincare', subcategory: 'serum', description: 'Targets blemishes, congestion, and uneven skin tone with 10% niacinamide.', isBestseller: true, isNewProduct: false, tags: ['niacinamide', 'pore-refining'], stock: 180 },
  { name: 'Eau de Parfum Bloom', brand: 'Charlotte Tilbury', price: 3500, originalPrice: 4500, discount: 22, rating: 4.8, reviews: 2134, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop', category: 'fragrance', subcategory: 'perfume', description: 'A floral masterpiece with notes of jasmine, tuberose, and sandalwood.', isBestseller: false, isNewProduct: true, tags: ['floral', 'luxury'], stock: 40 },
  { name: 'Compact Powder Matte', brand: 'Maybelline', price: 349, originalPrice: 499, discount: 30, rating: 4.1, reviews: 9876, image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=500&fit=crop', category: 'makeup', subcategory: 'face', description: 'Ultra-fine pressed powder for a flawless matte finish that lasts all day.', isBestseller: false, isNewProduct: false, tags: ['matte', 'compact'], stock: 70 },
  { name: 'Retinol Night Cream', brand: 'Clinique', price: 1899, originalPrice: 2499, discount: 24, rating: 4.5, reviews: 4567, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop', category: 'skincare', subcategory: 'night-cream', description: 'Advanced retinol formula that works overnight to reduce fine lines and wrinkles.', isBestseller: false, isNewProduct: true, tags: ['retinol', 'anti-aging'], stock: 55 },
  { name: 'Tea Tree Face Wash', brand: 'The Ordinary', price: 450, originalPrice: 650, discount: 31, rating: 4.3, reviews: 6789, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop', category: 'natural', subcategory: 'face-wash', description: '100% natural tea tree oil face wash that deeply cleanses and fights acne-causing bacteria.', isBestseller: false, isNewProduct: false, tags: ['natural', 'tea-tree', 'acne'], stock: 95 },
  { name: 'Aloe Vera Gel', brand: 'Lakme', price: 199, originalPrice: 299, discount: 33, rating: 4.0, reviews: 3456, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop', category: 'natural', subcategory: 'moisturizer', description: 'Pure aloe vera gel for soothing, hydrating, and healing skin naturally.', isBestseller: false, isNewProduct: false, tags: ['aloe', 'natural', 'soothing'], stock: 130 },
  { name: 'Baby Gentle Shampoo', brand: 'Clinique', price: 349, originalPrice: 499, discount: 30, rating: 4.6, reviews: 2100, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop', category: 'mom-baby', subcategory: 'shampoo', description: 'Tear-free, hypoallergenic baby shampoo with natural ingredients for delicate scalps.', isBestseller: false, isNewProduct: false, tags: ['baby', 'gentle', 'tear-free'], stock: 85 },
  { name: 'Baby Moisturizing Lotion', brand: 'Clinique', price: 399, originalPrice: 549, discount: 27, rating: 4.4, reviews: 1890, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop', category: 'mom-baby', subcategory: 'lotion', description: 'Dermatologist-tested baby lotion that keeps skin soft and moisturized for 24 hours.', isBestseller: false, isNewProduct: false, tags: ['baby', 'moisturizing', 'gentle'], stock: 75 },
  { name: 'Hair Straightener Pro', brand: "L'Oréal", price: 2499, originalPrice: 3999, discount: 37, rating: 4.2, reviews: 4321, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=500&fit=crop', category: 'appliances', subcategory: 'straightener', description: 'Professional ceramic hair straightener with adjustable temperature for salon-smooth results.', isBestseller: false, isNewProduct: false, tags: ['straightener', 'professional', 'ceramic'], stock: 35 },
  { name: 'Hair Dryer Ionic', brand: "L'Oréal", price: 1899, originalPrice: 2999, discount: 37, rating: 4.3, reviews: 3678, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=500&fit=crop', category: 'appliances', subcategory: 'dryer', description: 'Ionic hair dryer that reduces frizz and dries hair 50% faster with less heat damage.', isBestseller: false, isNewProduct: false, tags: ['dryer', 'ionic', 'professional'], stock: 28 },
  { name: 'Oud Wood Perfume', brand: 'Charlotte Tilbury', price: 4200, originalPrice: 5500, discount: 24, rating: 4.7, reviews: 1567, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop', category: 'fragrance', subcategory: 'perfume', description: 'Rich woody fragrance with oud, sandalwood, and warm amber for a sophisticated aura.', isBestseller: false, isNewProduct: false, tags: ['woody', 'oud', 'luxury'], stock: 22 },
  { name: 'Lavender Body Mist', brand: 'Lakme', price: 599, originalPrice: 799, discount: 25, rating: 4.1, reviews: 2345, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop', category: 'fragrance', subcategory: 'body-mist', description: 'Light and refreshing lavender body mist perfect for everyday wear.', isBestseller: false, isNewProduct: false, tags: ['lavender', 'fresh', 'everyday'], stock: 65 },
  { name: 'Shea Butter Body Cream', brand: 'Lakme', price: 449, originalPrice: 599, discount: 25, rating: 4.2, reviews: 3210, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400&h=500&fit=crop', category: 'bath-body', subcategory: 'body-cream', description: 'Rich shea butter body cream that deeply nourishes and repairs dry skin.', isBestseller: false, isNewProduct: false, tags: ['shea-butter', 'nourishing', 'moisturizing'], stock: 88 },
  { name: 'Coconut Hair Oil', brand: 'Nykaa', price: 299, originalPrice: 399, discount: 25, rating: 4.0, reviews: 5432, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=500&fit=crop', category: 'haircare', subcategory: 'oil', description: 'Cold-pressed virgin coconut oil for deep conditioning and strengthening hair roots.', isBestseller: false, isNewProduct: false, tags: ['coconut', 'natural', 'conditioning'], stock: 120 },
  { name: 'Sunscreen SPF 50+', brand: 'Clinique', price: 799, originalPrice: 999, discount: 20, rating: 4.5, reviews: 8765, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop', category: 'skincare', subcategory: 'sunscreen', description: 'Lightweight, non-greasy SPF 50+ sunscreen with PA++++ protection for all skin types.', isBestseller: true, isNewProduct: false, tags: ['sunscreen', 'spf', 'lightweight'], stock: 210 },
  { name: 'Eyeshadow Palette Nude', brand: 'MAC', price: 2800, originalPrice: 3500, discount: 20, rating: 4.6, reviews: 6543, image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=500&fit=crop', category: 'makeup', subcategory: 'eyes', description: '12-shade nude eyeshadow palette with matte, shimmer, and metallic finishes.', isBestseller: true, isNewProduct: false, tags: ['eyeshadow', 'nude', 'palette'], stock: 45 },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    User.deleteMany({ role: 'admin' }),
  ]);
  console.log('🗑️  Cleared existing data');

  // Seed categories
  await Category.insertMany(categoryData);
  console.log(`✅ Seeded ${categoryData.length} categories`);

  // Seed brands
  await Brand.insertMany(brandData);
  console.log(`✅ Seeded ${brandData.length} brands`);

  // Seed products (add images array = [image] for gallery support)
  const productsWithImages = productData.map((p) => ({
    ...p,
    images: [p.image, p.image, p.image],
  }));
  await Product.insertMany(productsWithImages);
  console.log(`✅ Seeded ${productData.length} products`);

  // Create admin user
  await User.create({
    firstName: 'Admin',
    lastName: 'Ekanshi',
    email: 'admin@Ekanshi.com',
    password: 'admin@123456',
    role: 'admin',
    isEmailVerified: true,
  });
  console.log('✅ Created admin user: admin@Ekanshi.com / admin@123456');

  await mongoose.disconnect();
  console.log('\n🎉 Database seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
