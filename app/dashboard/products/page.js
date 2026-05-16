'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { categories } from '@/data/mockData';

export default function ManageProductsPage() {
  const { shops, getProductsByShop, updateProduct, deleteProduct } = useShop();
  const myShop = shops[0];
  const allProducts = myShop ? getProductsByShop(myShop.id) : [];
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [stockVal, setStockVal] = useState('');

  const filtered = filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter);
  const usedCategories = ['all', ...new Set(allProducts.map(p => p.category))];

  function handleToggleAvailable(product) {
    updateProduct(product.id, { available: !product.available });
  }

  function handleDeleteConfirm(id) {
    deleteProduct(id);
    setConfirmDelete(null);
  }

  function handleStockSave(product) {
    const val = parseInt(stockVal);
    if (!isNaN(val) && val >= 0) {
      updateProduct(product.id, { stock: val, available: val > 0 });
    }
    setEditingStock(null);
  }

  if (!myShop) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="text-6xl">🏪</span>
        <p className="mt-4 font-semibold text-gray-800">Create your shop first</p>
        <Link href="/dashboard/shop" className="mt-4 inline-block bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
          Set Up Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Products ({allProducts.length})</h1>
        </div>
        <Link href="/dashboard/add-product" className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {usedCategories.map(cat => {
          const info = categories.find(c => c.id === cat);
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'}`}>
              {info ? `${info.icon} ${info.name}` : 'All'}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <span className="text-5xl">📦</span>
          <p className="mt-3">No products yet.</p>
          <Link href="/dashboard/add-product" className="mt-4 inline-block text-primary-600 font-medium hover:underline">Add your first product</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => {
                  const catInfo = categories.find(c => c.id === product.category);
                  return (
                    <tr key={product.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{catInfo ? `${catInfo.icon} ${catInfo.name}` : product.category}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">₹{product.price}/{product.unit}</td>
                      <td className="py-3 px-4">
                        {editingStock === product.id ? (
                          <div className="flex items-center gap-1">
                            <input type="number" value={stockVal} onChange={e => setStockVal(e.target.value)} min="0"
                              className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400" />
                            <button onClick={() => handleStockSave(product)} className="text-primary-600 hover:text-primary-800 text-xs font-medium">Save</button>
                            <button onClick={() => setEditingStock(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingStock(product.id); setStockVal(String(product.stock)); }}
                            className="text-gray-600 hover:text-primary-600 font-medium">
                            {product.stock} {product.unit}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleToggleAvailable(product)}
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${product.available ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                          {product.available ? 'Available' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/product/${product.id}`} className="text-gray-400 hover:text-primary-600 transition-colors" title="Preview">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          {confirmDelete === product.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteConfirm(product.id)} className="text-xs text-red-600 font-medium hover:text-red-800">Confirm</button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
