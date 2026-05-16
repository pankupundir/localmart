'use client';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Image from 'next/image';

const DEMO_SHOP_ID = 'shop-1';

export default function DashboardPage() {
  const { shops, products, getProductsByShop } = useShop();
  // For demo: use first shop or let user pick
  const myShop = shops[0];
  const myProducts = myShop ? getProductsByShop(myShop.id) : [];
  const availableCount = myProducts.filter(p => p.available).length;
  const outOfStockCount = myProducts.filter(p => !p.available).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopkeeper Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your shop and products</p>
        </div>
        <Link href="/dashboard/shop" className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Shop Settings
        </Link>
      </div>

      {!myShop ? (
        /* No shop yet */
        <div className="bg-white rounded-2xl border border-dashed border-primary-300 p-12 text-center">
          <span className="text-6xl">🏪</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Set up your shop</h2>
          <p className="text-gray-500 mt-2">Create your shop profile to start selling your products</p>
          <Link href="/dashboard/shop" className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Create My Shop
          </Link>
        </div>
      ) : (
        <>
          {/* Shop Preview Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="relative h-32 bg-gray-200">
              <Image src={myShop.banner || myShop.image} alt={myShop.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-5 flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white -mt-8 flex-shrink-0 shadow">
                <Image src={myShop.image} alt={myShop.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900">{myShop.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${myShop.isOpen ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                    {myShop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{myShop.location}</p>
              </div>
              <Link href={`/shop/${myShop.id}`} className="text-sm text-primary-600 hover:underline flex-shrink-0">View Shop →</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Products', value: myProducts.length, icon: '📦', color: 'text-blue-600 bg-blue-50' },
              { label: 'Available', value: availableCount, icon: '✅', color: 'text-primary-600 bg-primary-50' },
              { label: 'Out of Stock', value: outOfStockCount, icon: '❌', color: 'text-red-600 bg-red-50' },
              { label: 'Rating', value: myShop.rating || 'New', icon: '⭐', color: 'text-yellow-600 bg-yellow-50' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2 ${stat.color}`}>{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Link href="/dashboard/add-product" className="bg-primary-600 text-white rounded-2xl p-5 hover:bg-primary-700 transition-colors group">
              <span className="text-3xl">➕</span>
              <p className="font-bold mt-2">Add Product</p>
              <p className="text-sm text-primary-200 mt-0.5">List a new product</p>
            </Link>
            <Link href="/dashboard/products" className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:border-primary-300 transition-colors">
              <span className="text-3xl">📋</span>
              <p className="font-bold text-gray-800 mt-2">Manage Products</p>
              <p className="text-sm text-gray-500 mt-0.5">Edit, toggle stock</p>
            </Link>
            <Link href="/dashboard/shop" className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:border-primary-300 transition-colors">
              <span className="text-3xl">🏪</span>
              <p className="font-bold text-gray-800 mt-2">Edit Shop</p>
              <p className="text-sm text-gray-500 mt-0.5">Update info, timings</p>
            </Link>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Products</h3>
              <Link href="/dashboard/products" className="text-sm text-primary-600 hover:underline">View All</Link>
            </div>
            {myProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No products yet. Add your first product!</p>
            ) : (
              <div className="space-y-3">
                {myProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">₹{p.price} / {p.unit}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.available ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'}`}>
                      {p.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
