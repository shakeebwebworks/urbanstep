import { formatPrice } from '../utils';

export default function OrderTotals({ subtotal, shipping, total }) {
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
      <div className="totals__grand"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
    </dl>
  );
}