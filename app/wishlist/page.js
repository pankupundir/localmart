'use client';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { shops } = useShop();

  function getShopName(shopId) {
    return shops.find(s => s.id === shopId)?.name || 'Local Shop';
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <span className="text-7xl">🤍</span>
        <p className="mt-4 text-xl font-semibold text-gray-600">Your wishlist is empty</p>
        <p className="text-sm mt-1 text-gray-400">Save products you love for later</p>
        <Link href="/" className="mt-6 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} shopName={getShopName(product.shopId)} />
        ))}
      </div>
    </div>
  );
}
