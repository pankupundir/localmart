'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { categories } from '@/data/mockData';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';

function HomeContent() {
  const searchParams = useSearchParams();
  const { shops, products } = useShop();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [activeTab, setActiveTab] = useState('products');
  const searchQuery = searchParams.get('search') || '';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const filteredShops = useMemo(() => {
    return shops.filter(s => {
      const matchCategory = activeCategory === 'all' || s.category === activeCategory;
      const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [shops, activeCategory, searchQuery]);

  function getShopName(shopId) {
    return shops.find(s => s.id === shopId)?.name || 'Local Shop';
  }

  return (
    <div>
      {/* Hero Banner */}
      {!searchQuery && activeCategory === 'all' && (
        <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Shop Local,<br />Support Your Community
              </h1>
              <p className="mt-3 text-primary-100 text-lg">Fresh products from shops near you. Best quality, best prices.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setActiveTab('products')} className="bg-white text-primary-700 px-5 py-2 rounded-full font-semibold hover:bg-primary-50 transition-colors">
                  Browse Products
                </button>
                <button onClick={() => setActiveTab('shops')} className="border border-white text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-600 transition-colors">
                  Find Shops
                </button>
              </div>
            </div>
            <div className="text-7xl hidden md:block">🛍️</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search result header */}
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Results for &quot;<span className="text-primary-600">{searchQuery}</span>&quot;</h2>
            <p className="text-sm text-gray-500">{filteredProducts.length} products, {filteredShops.length} shops found</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="overflow-x-auto pb-2 mb-6">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'products' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Products ({filteredProducts.length})
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'shops' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Shops ({filteredShops.length})
            {activeTab === 'shops' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />}
          </button>
        </div>

        {/* Products Grid */}
        {activeTab === 'products' && (
          filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <span className="text-6xl">🔍</span>
              <p className="mt-4 text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} shopName={getShopName(product.shopId)} />
              ))}
            </div>
          )
        )}

        {/* Shops Grid */}
        {activeTab === 'shops' && (
          filteredShops.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <span className="text-6xl">🏪</span>
              <p className="mt-4 text-lg font-medium">No shops found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
