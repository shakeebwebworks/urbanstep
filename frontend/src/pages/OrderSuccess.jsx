import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatPrice, usePageMeta } from '../utils';
import Button from '../components/Button';
import OrderTotals from '../components/OrderTotals';
import Icon from '../components/Icon';

export default function OrderSuccess() {
  usePageMeta('Order confirmed', 'Your UrbanStep order has been placed.');
  const order = useLocation().state?.order;

  // If someone opens this URL directly, there is no order to show.
  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div className="text-center mb-4">
        <span className="success-badge"><Icon name="check" size={32} /></span>
        <h1>Thank you, {order.name.split(' ')[0]}!</h1>
        <p className="text-muted">
          Your order <strong>{order.order_id}</strong> is confirmed. A receipt would be sent to {order.email}.
        </p>
      </div>
      <div className="summary">
        <ul className="list-unstyled mb-3">
          {order.items.map((item) => (
            <li key={`${item.product.id}-${item.size}`} className="d-flex justify-content-between py-1">
              <span>{item.qty} × {item.product.name} ({item.size})</span>
              <span>{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
        <OrderTotals subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
        <p className="small text-muted mb-0 mt-3">Shipping to: {order.address}</p>
      </div>
      <div className="text-center mt-4"><Button as={Link} to="/products" className="btn-brand">Continue shopping</Button></div>
    </div>
  );
}