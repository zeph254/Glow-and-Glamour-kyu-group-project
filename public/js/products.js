const products = [
  { id: 1, name: "Rose Glow Vitamin C Serum", price: 1200, category: "skincare", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop", stock: 15, description: "Hydrating vitamin C serum for radiant, glowing skin with rose extract.", rating: 4.8, reviews: 124 },
  { id: 2, name: "Matte Liquid Lipstick - Ruby", price: 650, category: "makeup", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop", stock: 30, description: "Long-lasting matte finish liquid lipstick in deep ruby red.", rating: 4.6, reviews: 89 },
  { id: 3, name: "Moroccan Argan Hair Oil", price: 950, category: "hair", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop", stock: 20, description: "Pure nourishing argan oil for silky, smooth, and shiny hair.", rating: 4.9, reviews: 156 },
  { id: 4, name: "Velvet Matte Foundation", price: 1500, category: "makeup", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500&h=500&fit=crop", stock: 12, description: "Full-coverage velvet matte foundation with 24-hour wear.", rating: 4.7, reviews: 203 },
  { id: 5, name: "Organic Shea Body Butter", price: 800, category: "skincare", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&h=500&fit=crop", stock: 25, description: "Rich organic shea butter for deep moisturizing and soft skin.", rating: 4.8, reviews: 167 },
  { id: 6, name: "Jasmine Eau de Parfum", price: 2800, category: "fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", stock: 8, description: "Luxurious floral jasmine scent, 50ml elegant bottle.", rating: 4.9, reviews: 94 },
  { id: 7, name: "Soothing Aloe Face Mask", price: 550, category: "skincare", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=500&h=500&fit=crop", stock: 40, description: "Soothing aloe vera mask for calm, refreshed, and hydrated skin.", rating: 4.5, reviews: 112 },
  { id: 8, name: "Keratin Silk Hair Mask", price: 1100, category: "hair", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=500&fit=crop", stock: 18, description: "Deep repair hair mask with keratin for damaged hair.", rating: 4.7, reviews: 145 },
  { id: 9, name: "Golden Glow Highlighter", price: 750, category: "makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop", stock: 22, description: "Shimmering golden glow powder highlighter for radiant cheeks.", rating: 4.6, reviews: 178 },
  { id: 10, name: "Coconut Sugar Body Scrub", price: 700, category: "skincare", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop", stock: 0, description: "Exfoliating coconut sugar scrub for smooth, glowing skin.", rating: 4.8, reviews: 134 },
  { id: 11, name: "Vanilla Dream Body Mist", price: 900, category: "fragrance", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop", stock: 16, description: "Light vanilla body mist, 100ml refreshing spray.", rating: 4.5, reviews: 87 },
  { id: 12, name: "Precision Brow Pencil - Brown", price: 450, category: "makeup", image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500&h=500&fit=crop", stock: 35, description: "Precise brow pencil in natural brown for perfect arches.", rating: 4.7, reviews: 156 },
  { id: 13, name: "Hyaluronic Acid Hydrating Serum", price: 1400, category: "skincare", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&h=500&fit=crop", stock: 20, description: "Intense hydration serum that plumps and smooths fine lines.", rating: 4.9, reviews: 210 },
  { id: 14, name: "Niacinamide Brightening Toner", price: 950, category: "skincare", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop", stock: 28, description: "Gentle exfoliating toner that minimizes pores and evens skin tone.", rating: 4.6, reviews: 142 },
  { id: 15, name: "Retinol Anti-Aging Night Cream", price: 1800, category: "skincare", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd026b?w=500&h=500&fit=crop", stock: 10, description: "Powerful night cream to reduce wrinkles and boost collagen.", rating: 4.8, reviews: 98 },
  { id: 16, name: "Invisible Sunscreen SPF 50+", price: 1200, category: "skincare", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop", stock: 45, description: "Weightless, non-greasy sun protection for all skin tones.", rating: 4.9, reviews: 315 },
  { id: 17, name: "Waterproof Volumizing Mascara", price: 850, category: "makeup", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500&h=500&fit=crop", stock: 50, description: "Dramatic volume and length that lasts all day without smudging.", rating: 4.5, reviews: 189 },
  { id: 18, name: "Long-Wear Makeup Setting Spray", price: 700, category: "makeup", image: "https://images.unsplash.com/photo-1596462502278-27bfd3f6ae49?w=500&h=500&fit=crop", stock: 33, description: "Locks in your makeup for up to 16 hours with a natural finish.", rating: 4.7, reviews: 220 },
  { id: 19, name: "Rosy Cheeks Blush Palette", price: 900, category: "makeup", image: "https://images.unsplash.com/photo-1512499617640-c2f999098e95?w=500&h=500&fit=crop", stock: 15, description: "Three complementary shades for a custom, healthy flush.", rating: 4.6, reviews: 112 },
  { id: 20, name: "Waterproof Gel Eyeliner - Black", price: 550, category: "makeup", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop", stock: 40, description: "Intense black pigment with a smooth, smudge-proof application.", rating: 4.8, reviews: 167 },
  { id: 21, name: "Coconut Leave-In Conditioner", price: 800, category: "hair", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop", stock: 25, description: "Detangles and protects hair from heat damage and frizz.", rating: 4.7, reviews: 134 },
  { id: 22, name: "Peppermint Scalp Scrub", price: 1000, category: "hair", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=500&h=500&fit=crop", stock: 18, description: "Exfoliates the scalp to promote healthy hair growth and reduce dandruff.", rating: 4.6, reviews: 88 },
  { id: 23, name: "Biotin Hair Growth Serum", price: 1300, category: "hair", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=500&fit=crop", stock: 12, description: "Targeted treatment to strengthen roots and reduce hair fall.", rating: 4.8, reviews: 156 },
  { id: 24, name: "Midnight Oud Wood Perfume", price: 3500, category: "fragrance", image: "https://images.unsplash.com/photo-1594035910387-fea47794961f?w=500&h=500&fit=crop", stock: 6, description: "A rich, woody, and mysterious scent for evening elegance.", rating: 4.9, reviews: 75 }
];

function findProduct(id) {
  return products.find(p => p.id === id);
}

function getProductsByCategory(category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

function getFeaturedProducts() {
  return products.filter(p => p.rating >= 4.7).slice(0, 4);
}