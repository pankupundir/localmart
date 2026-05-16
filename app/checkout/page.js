'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '', landmark: '' });
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState('ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase());

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Enter valid 6-digit pincode';
    return e;
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    // Save order to localStorage
    const order = { id: orderId, items: cart, total: totalPrice, address: form, status: 'Confirmed', date: new Date().toISOString(), paymentMethod: 'Cash on Delivery' };
    const existing = JSON.parse(localStorage.getItem('lm_orders') || '[]');
    localStorage.setItem('lm_orders', JSON.stringify([order, ...existing]));
    clearCart();
    setPlaced(true);
  }

  if (cart.length === 0 && !placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <span className="text-7xl">🛒</span>
        <p className="mt-4 text-xl font-semibold text-gray-600">No items to checkout</p>
        <Link href="/" className="mt-6 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 mt-2">Your order has been confirmed.</p>
          <div className="mt-4 bg-primary-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-primary-700">{orderId}</p>
          </div>
          <div className="mt-4 bg-amber-50 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-amber-800 mb-1">Cash on Delivery</p>
            <p className="text-sm text-amber-700">Please keep <span className="font-bold">₹{totalPrice}</span> ready at the time of delivery.</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">Delivering to: <span className="font-medium">{form.address}, {form.city} - {form.pincode}</span></p>
          <Link href="/" className="mt-6 block bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Delivery Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-800 mb-2">Delivery Details</h2>
            {field('name', 'Full Name', 'Enter your full name')}
            {field('phone', 'Mobile Number', '10-digit mobile number', 'tel')}
            {field('address', 'Full Address', 'House no., Street, Area')}
            <div className="grid grid-cols-2 gap-3">
              {field('city', 'City', 'Your city')}
              {field('pincode', 'Pincode', '6-digit pincode')}
            </div>
            {field('landmark', 'Landmark (optional)', 'Near school, temple...')}

            <div className="pt-2 border-t">
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-semibold text-amber-800">Cash on Delivery</p>
                  <p className="text-xs text-amber-600">Pay ₹{totalPrice} when your order arrives</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-base">
              Place Order — ₹{totalPrice}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order ({totalItems} items)</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-primary-600">Free</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>₹{totalPrice}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
