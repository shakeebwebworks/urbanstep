import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <p className="brand mb-2">URBAN<span>STEP</span></p>
            <p className="text-muted mb-3">Streetwear and sneakers for people who keep moving.</p>
            <div className="social">
              <a href="https://instagram.com" aria-label="UrbanStep on Instagram" target="_blank" rel="noreferrer"><Icon name="instagram" /></a>
              <a href="https://x.com" aria-label="UrbanStep on X" target="_blank" rel="noreferrer"><Icon name="x" /></a>
              <a href="https://facebook.com" aria-label="UrbanStep on Facebook" target="_blank" rel="noreferrer"><Icon name="facebook" /></a>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="footer-title">Shop</h2>
            <ul className="list-unstyled footer-links">
              <li><Link to="/products">All products</Link></li>
              <li><Link to="/products?category=sneakers">Sneakers</Link></li>
              <li><Link to="/products?category=hoodies">Hoodies</Link></li>
              <li><Link to="/products?category=jackets">Jackets</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h2 className="footer-title">Help</h2>
            <ul className="list-unstyled footer-links">
              <li><Link to="/cart">Your cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
              <li><a href="mailto:hello@urbanstep.example">hello@urbanstep.example</a></li>
            </ul>
          </div>
        </div>
        <p className="text-muted small text-center mt-5 mb-0">© {new Date().getFullYear()} UrbanStep. All rights reserved.</p>
      </div>
    </footer>
  );
}