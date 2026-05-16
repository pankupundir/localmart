'use client';
import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { categories } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ShopSettingsPage() {
  const { shops, addShop, updateShop } = useShop();
  const router = useRouter();
  const myShop = shops[0];

  const [form, setForm] = useState({
    name: '', owner: '', location: '', address: '', phone: '', category: 'vegetables',
    description: '', openTime: '9:00 AM', closeTime: '9:00 PM',
    image: '', banner: '', isOpen: true,
    tags: '',
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (myShop) {
      setForm({
        name: myShop.name || '',
        owner: myShop.owner || '',
        location: myShop.location || '',
        address: myShop.address || '',
        phone: myShop.phone || '',
        category: myShop.category || 'vegetables',
        description: myShop.description || '',
        openTime: myShop.openTime || '9:00 AM',
        closeTime: myShop.closeTime || '9:00 PM',
        image: myShop.image || '',
        banner: myShop.banner || '',
        isOpen: myShop.isOpen ?? true,
        tags: myShop.tags?.join(', ') || '',
      });
    }
  }, [myShop]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Shop name is required';
    if (!form.owner.trim()) e.owner = 'Owner name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter valid 10-digit phone';
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
    const shopData = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (myShop) {
      updateShop(myShop.id, shopData);
    } else {
      addShop(shopData);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push('/dashboard'); }, 1500);
  }

  const field = (name, label, placeholder, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{myShop ? 'Edit Shop' : 'Create Shop'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {field('name', 'Shop Name *', 'e.g. Fresh Farm Market')}
        {field('owner', 'Owner Name *', 'Your full name')}
        {field('phone', 'Phone Number *', '10-digit mobile number', 'tel')}
        {field('location', 'Location *', 'Area, City (e.g. Sector 15, Noida)')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Shop no., street, area, city, pincode" rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell customers about your shop..." rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('openTime', 'Opening Time', 'e.g. 9:00 AM')}
          {field('closeTime', 'Closing Time', 'e.g. 9:00 PM')}
        </div>
        {field('image', 'Shop Image URL', 'https://...')}
        {field('banner', 'Banner Image URL', 'https://...')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Fresh, Organic, Home Delivery"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isOpen" name="isOpen" checked={form.isOpen} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
          <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">Shop is currently Open</label>
        </div>
        <button type="submit" className={`w-full py-3 rounded-xl font-semibold transition-colors ${saved ? 'bg-primary-700 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
          {saved ? '✓ Saved!' : myShop ? 'Save Changes' : 'Create Shop'}
        </button>
      </form>
    </div>
  );
}
