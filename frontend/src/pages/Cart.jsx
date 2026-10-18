import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, usePageMeta } from '../utils';
import Button from '../components/Button';
import OrderTotals from '../components/OrderTotals';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

export default function Cart() {
  usePageMeta('Your Cart', 'Review the items in your UrbanStep cart.');
  const { cart, cartLoading, updateItem, removeItem } = useStore();

  if (cartLoading) return <div className="container section"><Spinner /></div>;

  if (cart.items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <Icon name="bag" size={44} />
          <h1 className="h2">Your cart is empty</h1>
          <p className="text-muted">Looks like you haven't added anything yet.</p>
          <Button as={Link} to="/products" className="btn-brand">Start shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="mb-4">Your cart</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          {cart.items.map((item) => (
            <div className="cart-row" key={`${item.product.id}-${item.size}`}>
              <Link to={`/products/${item.product.id}`} className="cart-row__img"><ProductImage product={item.product} /></Link>
              <div className="flex-grow-1">
                <h2 className="h6 mb-1"><Link to={`/products/${item.product.id}`}>{item.product.name}</Link></h2>
                <p className="text-muted small mb-2">Size: {item.size} · {formatPrice(item.product.price)} each</p>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <QuantityStepper value={item.qty} onChange={(q) => updateItem(item.product.id, item.size, q)} label={`Quantity for ${item.product.name}`} />
                  <button type="button" className="link-btn" onClick={() => removeItem(item.product.id, item.size)}>Remove</button>
                </div>
              </div>
              <p className="fw-bold mb-0">{formatPrice(item.line_total)}</p>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="summary">
            <h2 className="h5">Order summary</h2>
            <OrderTotals subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} />
            <Button as={Link} to="/checkout" className="btn-brand w-100 mt-3">Proceed to checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}