import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import Button from './Button';
import ProductImage from './ProductImage';
import Reveal from './Reveal';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useStore();
  const hasOneSize = product.sizes.length === 1;

  return (
    // Reveal handles the scroll animation; .product-card handles hover effects.
    <Reveal as="article" delay={(index % 4) * 80} className="h-100">
      <div className="product-card">
        <div className="product-card__media">
          <Link to={`/products/${product.id}`} tabIndex={-1}>
            <ProductImage product={product} />
          </Link>
          {/* One-size items can be added instantly; others need a size, so we send you to the product page. */}
          {hasOneSize ? (
            <Button className="btn-brand quick-add" onClick={() => addToCart(product, product.sizes[0], 1)}>
              Add to Cart
            </Button>
          ) : (
            <Button as={Link} to={`/products/${product.id}`} className="btn-brand quick-add">
              Choose Size
            </Button>
          )}
        </div>
        <div className="p-3">
          <p className="product-card__cat">{product.category}</p>
          <h3 className="product-card__name">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="product-card__price">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Reveal>
  );
}