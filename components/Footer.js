import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛒</span>
            <span className="text-white font-bold text-xl">LocalMart</span>
          </div>
          <p className="text-sm text-gray-400">Shop local, support your community. Find the best products from shops near you.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary-400 transition-colors">All Products</Link></li>
            <li><Link href="/?category=vegetables" className="hover:text-primary-400 transition-colors">Vegetables</Link></li>
            <li><Link href="/?category=fruits" className="hover:text-primary-400 transition-colors">Fruits</Link></li>
            <li><Link href="/?category=electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">My Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/wishlist" className="hover:text-primary-400 transition-colors">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-primary-400 transition-colors">Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-primary-400 transition-colors">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Sellers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
            <li><Link href="/dashboard/shop" className="hover:text-primary-400 transition-colors">Manage Shop</Link></li>
            <li><Link href="/dashboard/products" className="hover:text-primary-400 transition-colors">My Products</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2024 LocalMart. All rights reserved.
      </div>
    </footer>
  );
}
