'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { categories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { id } = useParams();
  const { getShopById, getProductsByShop } = useShop();
  const [activeCategory, setActiveCategory] = useState('all');

  const shop = getShopById(id);
  const allProducts = getProductsByShop(id);

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <span className="text-6xl">🏪</span>
        <p className="mt-4 text-lg font-medium">Shop not found</p>
        <Link href="/" className="mt-4 text-primary-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const productCategories = ['all', ...new Set(allProducts.map(p => p.category))];
  const filteredProducts = activeCategory === 'all' ? allProducts : allProducts.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <Image src={shop.banner || shop.image} alt={shop.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
              <Image src={shop.image} alt={shop.name} fill className="object-cover" />
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${shop.isOpen ? 'bg-primary-500' : 'bg-gray-500'}`}>
                  {shop.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-200 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {shop.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Shop Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 text-yellow-400 mb-1">
              <span>★</span>
              <span className="font-bold text-gray-800">{shop.rating || 'New'}</span>
            </div>
            <p className="text-xs text-gray-500">{shop.totalReviews} Reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-800">{allProducts.length}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-800 text-sm">{shop.openTime} – {shop.closeTime}</p>
            <p className="text-xs text-gray-500">Timings</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <a href={`tel:${shop.phone}`} className="font-bold text-primary-600 text-sm">📞 Call</a>
            <p className="text-xs text-gray-500">{shop.phone}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-1">About</h2>
          <p className="text-sm text-gray-600">{shop.description}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-start gap-1">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {shop.address}
          </p>
          {shop.tags?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {shop.tags.map(tag => (
                <span key={tag} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full border border-primary-100">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Products */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Products ({allProducts.length})</h2>

        {/* Category filter for shop */}
        {productCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {productCategories.map(cat => {
              const catInfo = categories.find(c => c.id === cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
                  }`}
                >
                  {catInfo ? `${catInfo.icon} ${catInfo.name}` : cat}
                </button>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} shopName={shop.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
