'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductPage() {
  const { id } = useParams();
  const { products, getShopById } = useShop();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === id);
  const shop = product ? getShopById(product.shopId) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <span className="text-6xl">📦</span>
        <p className="mt-4 text-lg font-medium">Product not found</p>
        <Link href="/" className="mt-4 text-primary-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setIsCartOpen(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        {shop && <Link href={`/shop/${shop.id}`} className="hover:text-primary-600">{shop.name}</Link>}
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            {!product.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-700 font-semibold px-4 py-2 rounded-full">Out of Stock</span>
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <svg className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            {shop && (
              <Link href={`/shop/${shop.id}`} className="text-sm text-primary-600 font-medium hover:underline mb-2">{shop.name}</Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400 text-sm">{'★'.repeat(Math.round(product.rating || 0))}</div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="mt-4 pb-4 border-b border-gray-100">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-gray-500 text-sm ml-1">per {product.unit}</span>
            </div>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{product.description}</p>

            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.available ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'}`}>
                {product.available ? `In Stock (${product.stock} ${product.unit} available)` : 'Out of Stock'}
              </span>
            </div>

            {product.available && (
              <div className="mt-6 space-y-3">
                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Qty:</span>
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold">-</button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold">+</button>
                  </div>
                  <span className="text-sm text-gray-500">= ₹{product.price * quantity}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${added ? 'bg-primary-700 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                  >
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-3 rounded-xl font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors text-center"
                  >
                    Buy Now (COD)
                  </Link>
                </div>
              </div>
            )}

            {/* Shop info */}
            {shop && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href={`/shop/${shop.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{shop.name}</p>
                    <p className="text-xs text-gray-500">{shop.location}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
