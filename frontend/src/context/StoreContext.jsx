// Global state shared by every component: cart, toasts and theme.
import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const EMPTY_CART = { items: [], count: 0, subtotal: 0, shipping: 0, total: 0 };

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(EMPTY_CART);
  const [cartLoading, setCartLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [bump, setBump] = useState(0); // changes each time an item is added -> replays badge animation
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-bs-theme') || 'light'
  );

  // Dark mode: set the attribute Bootstrap uses and remember the choice.
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    try { localStorage.setItem('urbanstep-theme', theme); } catch { /* storage blocked */ }
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Load the cart once when the app starts (this also sets Django's CSRF cookie).
  useEffect(() => {
    api.getCart().then(setCart).catch(() => {}).finally(() => setCartLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const addToCart = async (product, size, qty = 1) => {
    try {
      setCart(await api.addToCart(product.id, size, qty));
      setBump((b) => b + 1);
      showToast(`${product.name} added to cart`);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateItem = async (id, size, qty) => {
    try { setCart(await api.updateCart(id, size, qty)); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const removeItem = async (id, size) => {
    try { setCart(await api.removeFromCart(id, size)); showToast('Item removed', 'success'); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const clearCart = () => setCart(EMPTY_CART);

  const value = { cart, cartLoading, bump, toasts, theme, toggleTheme, showToast, addToCart, updateItem, removeItem, clearCart };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}