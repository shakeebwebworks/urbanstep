import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import { usePageMeta } from '../utils';
import Button from '../components/Button';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import { ProductGridSkeleton } from '../components/Skeleton';

const CATEGORIES = [
  { slug: 'sneakers', label: 'Sneakers' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'jackets', label: 'Jackets' },
  { slug: 'accessories', label: 'Accessories' },
];

const USPS = [
  { icon: 'truck', title: 'Free shipping', text: 'On all orders over $100' },
  { icon: 'returns', title: 'Easy returns', text: '30 days, no questions asked' },
  { icon: 'lock', title: 'Secure checkout', text: 'Your details stay protected' },
];

const TESTIMONIALS = [
  { name: 'Aarav M.', text: 'The Aero Runners are unbelievably comfortable. Delivery was quick and the fit was perfect.' },
  { name: 'Sofia L.', text: 'Best hoodie I own. Heavy fabric, great colour, and it still looks new after many washes.' },
  { name: 'Jordan K.', text: 'Easy site, fast checkout, and the bomber jacket looks even better in person.' },
];

export default function Home() {
  usePageMeta('', 'Shop UrbanStep for streetwear, hoodies, jackets and fresh sneakers. Free shipping over $100.');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(''); // '', 'error' or 'ok'

  useEffect(() => {
    getProducts()
      .then((d) => setProducts(d.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 8);
  // Hero photos: one featured product from each category (up to 4).
  const heroItems = CATEGORIES.map((c) => featured.find((p) => p.category === c.slug)).filter(Boolean);

  const subscribe = (e) => {
    e.preventDefault();
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    setNewsletter(valid ? 'ok' : 'error');
    if (valid) setEmail('');
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <p className="eyebrow hero-anim" style={{ '--d': '0ms' }}>Autumn / Winter 2026</p>
              <h1 className="hero-anim" style={{ '--d': '120ms' }}>Built for<br />the city.</h1>
              <p className="lead text-muted hero-anim" style={{ '--d': '240ms' }}>
                New sneakers, hoodies and jackets. Everyday pieces made to be worn hard.
              </p>
              <div className="d-flex flex-wrap gap-3 hero-anim" style={{ '--d': '360ms' }}>
                <Button as={Link} to="/products" className="btn-brand btn-lg">Shop new arrivals <Icon name="arrow" size={18} /></Button>
                <Button as={Link} to="/products?category=sneakers" className="btn-outline-ink btn-lg">Sneakers</Button>
              </div>
            </div>
            <div className="col-lg-7 hero-anim" style={{ '--d': '300ms' }}>
              <div className="hero-mosaic">
                {loading
                  ? [0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '4/5' }} />)
                  : heroItems.map((p) => (
                      <Link key={p.id} to={`/products/${p.id}`} className="hero-tile" aria-label={`View ${p.name}`}>
                        <ProductImage product={p} />
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="usp" aria-label="Why shop with us">
        <div className="container">
          <div className="row g-3">
            {USPS.map((u) => (
              <div className="col-md-4" key={u.title}>
                <div className="usp__item">
                  <Icon name={u.icon} size={26} />
                  <div><strong>{u.title}</strong><span>{u.text}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">Shop by category</h2></Reveal>
          <div className="row g-3 row-cols-2 row-cols-md-4">
            {CATEGORIES.map((c, i) => {
              const cover = products.find((p) => p.category === c.slug);
              return (
                <Reveal className="col" delay={i * 80} key={c.slug}>
                  <Link to={`/products?category=${c.slug}`} className="category-tile">
                    {cover ? <ProductImage product={cover} /> : <div className="skeleton h-100" />}
                    <span className="category-tile__label">{c.label} <Icon name="arrow" size={18} /></span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section section--alt">
        <div className="container">
          <Reveal className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="section-title mb-0">Featured</h2>
            <Link to="/products" className="text-link">View all</Link>
          </Reveal>
          {error && <p className="text-danger" role="alert">{error}</p>}
          {loading ? <ProductGridSkeleton count={8} /> : (
            <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-xl-4">
              {featured.map((p, i) => <div className="col" key={p.id}><ProductCard product={p} index={i} /></div>)}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">What customers say</h2></Reveal>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <Reveal className="col-md-4" delay={i * 100} key={t.name}>
                <figure className="testimonial h-100">
                  <blockquote className="mb-3">“{t.text}”</blockquote>
                  <figcaption className="fw-semibold">{t.name}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section section--alt">
        <Reveal className="container text-center newsletter">
          <h2 className="section-title">Join the list</h2>
          <p className="text-muted">Early access to drops and member-only offers.</p>
          <form onSubmit={subscribe} noValidate className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
            <input id="newsletter-email" type="email" className={`form-control ${newsletter === 'error' ? 'is-invalid' : ''}`}
                   placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                   aria-describedby="newsletter-msg" autoComplete="email" />
            <Button type="submit" className="btn-brand">Subscribe</Button>
          </form>
          <p id="newsletter-msg" className="mt-3 mb-0" role="status">
            {newsletter === 'ok' && 'Thanks for subscribing!'}
            {newsletter === 'error' && <span className="text-danger">Please enter a valid email address.</span>}
          </p>
        </Reveal>
      </section>
    </>
  );
}