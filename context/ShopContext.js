'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { shops as mockShops, products as mockProducts } from '@/data/mockData';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [shops, setShops] = useState(mockShops);
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    const storedShops = localStorage.getItem('lm_shops');
    const storedProducts = localStorage.getItem('lm_products');
    if (storedShops) setShops(JSON.parse(storedShops));
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  function saveShops(updated) {
    setShops(updated);
    localStorage.setItem('lm_shops', JSON.stringify(updated));
  }

  function saveProducts(updated) {
    setProducts(updated);
    localStorage.setItem('lm_products', JSON.stringify(updated));
  }

  function addShop(shop) {
    const newShop = { ...shop, id: 'shop-' + Date.now(), rating: 0, totalReviews: 0, isOpen: true };
    saveShops([...shops, newShop]);
    return newShop.id;
  }

  function updateShop(shopId, data) {
    saveShops(shops.map(s => s.id === shopId ? { ...s, ...data } : s));
  }

  function addProduct(product) {
    const newProduct = { ...product, id: 'p-' + Date.now(), rating: 0, reviews: 0, available: true };
    saveProducts([...products, newProduct]);
  }

  function updateProduct(productId, data) {
    saveProducts(products.map(p => p.id === productId ? { ...p, ...data } : p));
  }

  function deleteProduct(productId) {
    saveProducts(products.filter(p => p.id !== productId));
  }

  function getShopById(shopId) {
    return shops.find(s => s.id === shopId);
  }

  function getProductsByShop(shopId) {
    return products.filter(p => p.shopId === shopId);
  }

  return (
    <ShopContext.Provider value={{ shops, products, addShop, updateShop, addProduct, updateProduct, deleteProduct, getShopById, getProductsByShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
