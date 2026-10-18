import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toasts from './components/Toasts';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';

// Wraps the routes so each page fades/slides in when the URL changes.
function AnimatedRoutes() {
  const location = useLocation();

  // Jump to the top whenever we open a new page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    // "key" makes React re-create this div on navigation, which replays the CSS animation.
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
      <Toasts />
      <BackToTop />
    </StoreProvider>
  );
}