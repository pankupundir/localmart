'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product, shopName }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(product);
    setIsCartOpen(true);
  }

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-primary-600 font-medium mb-1 truncate">{shopName || 'Local Shop'}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-bold text-gray-900">₹{product.price}</span>
            <span className="text-xs text-gray-400">/{product.unit}</span>
          </div>
          {product.available ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 text-white text-xs px-3 py-1.5 rounded-full hover:bg-primary-700 transition-colors font-medium"
            >
              Add
            </button>
          ) : (
            <span className="text-xs text-gray-400 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </Link>
  );
}
