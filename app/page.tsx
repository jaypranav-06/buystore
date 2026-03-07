import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db/prisma';
import { Star, ShoppingBag } from 'lucide-react';

async function getHomePageData() {
  const [featuredProducts, newArrivals, bestsellers, categories] = await Promise.all([
    // Featured Products
    prisma.product.findMany({
      where: {
        is_featured: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // New Arrivals
    prisma.product.findMany({
      where: {
        is_new: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // Bestsellers
    prisma.product.findMany({
      where: {
        is_bestseller: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // Categories
    prisma.category.findMany({
      where: { is_active: true },
      take: 6,
      orderBy: { created_at: 'desc' },
    }),
  ]);

  return { featuredProducts, newArrivals, bestsellers, categories };
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, bestsellers, categories } = await getHomePageData();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore our curated collection of premium fashion and accessories
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/products?category=${category.category_id}`}
                  className="group"
                >
                  <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-blue-50 transition">
                    {category.image_url && (
                      <div className="mb-4 relative h-24 w-24 mx-auto">
                        <Image
                          src={category.image_url}
                          alt={category.category_name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {category.category_name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link href="/products?featured=true" className="text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <Link href="/products?new=true" className="text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Bestsellers</h2>
              <Link href="/products?bestseller=true" className="text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for exclusive offers and updates
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;

  return (
    <Link href={`/products/${product.product_id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
        <div className="relative aspect-square">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.product_name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
          )}
          {product.is_new && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {product.discount_price && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category?.category_name}</p>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.product_name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < 4 ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
