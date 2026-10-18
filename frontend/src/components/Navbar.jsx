import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Icon from './Icon';

export default function Navbar() {
  const { cart, bump, theme, toggleTheme } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <div className="announce">Free shipping on orders over $100 · 30-day returns</div>
      <header className={`site-header sticky-top ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container">
            <Link to="/" className="brand order-1">URBAN<span>STEP</span></Link>

            <div className="d-flex align-items-center gap-1 ms-auto order-2 order-lg-3">
              <button type="button" className="icon-btn" onClick={toggleTheme}
                      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={22} />
              </button>
              <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cart.count} items`}>
                <Icon name="bag" size={22} />
                {cart.count > 0 && (
                  <span key={bump} className={`cart-badge ${bump > 0 ? 'bounce' : ''}`}>{cart.count}</span>
                )}
              </Link>
              <button type="button" className="icon-btn d-lg-none" aria-expanded={open}
                      aria-controls="nav-links" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
                <Icon name={open ? 'close' : 'menu'} size={22} />
              </button>
            </div>

            <div id="nav-links" className={`collapse navbar-collapse order-3 order-lg-2 ${open ? 'show' : ''}`}>
              <ul className="navbar-nav ms-lg-5 me-auto">
                <li className="nav-item"><NavLink end to="/" className="nav-link">Home</NavLink></li>
                <li className="nav-item"><NavLink to="/products" className="nav-link">Shop all</NavLink></li>
                <li className="nav-item"><NavLink to="/products?category=sneakers" className="nav-link">Sneakers</NavLink></li>
                <li className="nav-item"><NavLink to="/products?category=hoodies" className="nav-link">Hoodies</NavLink></li>
                <li className="nav-item"><NavLink to="/products?category=jackets" className="nav-link">Jackets</NavLink></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}