import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api';
import { useStore } from '../context/StoreContext';
import { formatPrice, usePageMeta } from '../utils';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Reveal from '../components/Reveal';
import Spinner from '../components/Spinner';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((d) => { setData(d); setStatus('ready'); })
      .catch((e) => setStatus(e.status === 404 ? 'notfound' : 'error'));
  }, [id]);

  const product = data?.product;
  usePageMeta(product?.name, product?.description);

  if (status === 'loading') return <div className="container section"><Spinner /></div>;
  if (status === 'notfound') return <NotFound />;
  if (status === 'error') return <div className="container section"><p role="alert" className="text-danger">Could not load this product. Please try again.</p></div>;

  const handleAdd = () => {
    if (!size) { setSizeError(true); return; }
    addToCart(product, size, qty);
  };

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link to="/products">Shop</Link> / <Link to={`/products?category=${product.category}`} className="text-capitalize">{product.category}</Link> / <span className="text-muted">{product.name}</span>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <div className="detail-media"><ProductImage product={product} /></div>
        </div>
        <div className="col-md-6">
          <p className="product-card__cat">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="fs-3 fw-bold">{formatPrice(product.price)}</p>
          <p className="text-muted">{product.description}</p>

          <p id="size-label" className="fw-semibold mb-2">Size</p>
          <div className="size-grid" role="group" aria-labelledby="size-label">
            {product.sizes.map((s) => (
              <button key={s} type="button" className={`size-btn ${size === s ? 'active' : ''}`} aria-pressed={size === s}
                      onClick={() => { setSize(s); setSizeError(false); }}>
                {s}
              </button>
            ))}
          </div>
          {sizeError && <p className="text-danger mt-2 mb-0" role="alert">Please select a size.</p>}

          <p className="fw-semibold mt-4 mb-2">Quantity</p>
          <QuantityStepper value={qty} onChange={setQty} />

          <Button className="btn-brand btn-lg mt-4 w-100" onClick={handleAdd}>Add to Cart</Button>
         <p className="text-muted small mt-3">Free shipping on orders over $100 · 30-day returns</p>
        </div>
      </div>

      <section className="mt-5 pt-4" aria-labelledby="related-title">
        <Reveal><h2 id="related-title" className="section-title">You may also like</h2></Reveal>
        <div className="row g-4 row-cols-2 row-cols-md-4">
          {data.related.map((p, i) => <div className="col" key={p.id}><ProductCard product={p} index={i} /></div>)}
        </div>
      </section>
    </div>
  );
}