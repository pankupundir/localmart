'use client';
import { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { categories } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const { shops, addProduct } = useShop();
  const router = useRouter();
  const myShop = shops[0];

  const [form, setForm] = useState({
    name: '', category: 'vegetables', price: '', unit: 'kg', stock: '', description: '', image: '', available: true,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Enter valid stock quantity';
    return e;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!myShop) { alert('Please create your shop first!'); router.push('/dashboard/shop'); return; }
    addProduct({ ...form, price: Number(form.price), stock: Number(form.stock), shopId: myShop.id });
    setSaved(true);
    setTimeout(() => { setSaved(false); setForm({ name: '', category: 'vegetables', price: '', unit: 'kg', stock: '', description: '', image: '', available: true }); }, 1500);
  }

  const units = ['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'bunch', 'pack', 'box', 'bottle', '500g', '250g', '100g'];

  const field = (name, label, placeholder, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors[name] ? 'border-red-400' : 'border-gray-200'}`} />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {field('name', 'Product Name *', 'e.g. Fresh Tomatoes')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('price', 'Price (₹) *', '0')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        {field('stock', 'Stock Quantity *', '0')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product..." rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
        </div>
        {field('image', 'Product Image URL', 'https://...')}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
          <label htmlFor="available" className="text-sm font-medium text-gray-700">Product is available for sale</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${saved ? 'bg-primary-700 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
            {saved ? '✓ Product Added!' : 'Add Product'}
          </button>
          <Link href="/dashboard/products" className="flex-1 py-3 rounded-xl font-semibold text-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            View Products
          </Link>
        </div>
      </form>
    </div>
  );
}
