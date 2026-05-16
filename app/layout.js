import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ShopProvider } from '@/context/ShopContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

export const metadata = {
  title: 'LocalMart — Shop Local, Support Your Community',
  description: 'Find fresh vegetables, fruits, electronics, clothing and more from local shops near you. Best prices, daily fresh stock.',
  keywords: 'local market, fresh vegetables, local shops, nearby stores, grocery delivery',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <ShopProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <CartSidebar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
