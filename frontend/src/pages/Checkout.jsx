import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkout } from '../api';
import { useStore } from '../context/StoreContext';
import { formatPrice, usePageMeta } from '../utils';
import Button from '../components/Button';
import OrderTotals from '../components/OrderTotals';
import Spinner from '../components/Spinner';

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Delivery address', type: 'textarea', autoComplete: 'street-address' },
];

// Same rules as the Django backend (the backend always re-checks them).
function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!/^\+?[0-9 ()-]{7,20}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (v.address.trim().length < 10) e.address = 'Please enter your full delivery address.';
  return e;
}

export default function Checkout() {
  usePageMeta('Checkout', 'Complete your UrbanStep order.');
  const { cart, cartLoading, clearCart } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const done = useRef(false); // true once the order is placed, so we don't redirect to the cart

  if (cartLoading) return <div className="container section"><Spinner /></div>;
  if (cart.items.length === 0 && !done.current) return <Navigate to="/cart" replace />;

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const handleBlur = (e) => {
    const msg = validate(values)[e.target.name];
    setErrors((prev) => ({ ...prev, [e.target.name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = validate(values);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) { document.getElementById(firstBad)?.focus(); return; }

    setSubmitting(true);
    try {
      const { order } = await checkout(values);
      done.current = true;
      navigate('/order-success', { state: { order } });
      clearCart();
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      else setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <h1 className="mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} noValidate>
            {FIELDS.map((f) => {
              const Tag = f.type === 'textarea' ? 'textarea' : 'input';
              return (
                <div className="mb-3" key={f.name}>
                  <label htmlFor={f.name} className="form-label fw-semibold">{f.label}</label>
                  <Tag id={f.name} name={f.name} type={f.type === 'textarea' ? undefined : f.type}
                       rows={f.type === 'textarea' ? 3 : undefined}
                       className={`form-control ${errors[f.name] ? 'is-invalid' : ''}`}
                       value={values[f.name]} onChange={handleChange} onBlur={handleBlur}
                       autoComplete={f.autoComplete} aria-invalid={!!errors[f.name]}
                       aria-describedby={errors[f.name] ? `${f.name}-error` : undefined} />
                  <div id={`${f.name}-error`} className="invalid-feedback" role="alert">{errors[f.name]}</div>
                </div>
              );
            })}
            {serverError && <p className="text-danger" role="alert">{serverError}</p>}
            <Button type="submit" className="btn-brand btn-lg w-100" disabled={submitting}>
              {submitting ? 'Placing order…' : `Place order · ${formatPrice(cart.total)}`}
            </Button>
            <p className="text-muted small mt-2">Demo store: no payment is taken.</p>
          </form>
        </div>
        <div className="col-lg-5">
          <div className="summary">
            <h2 className="h5">Order summary</h2>
            <ul className="list-unstyled mb-3">
              {cart.items.map((item) => (
                <li key={`${item.product.id}-${item.size}`} className="d-flex justify-content-between small py-1">
                  <span>{item.qty} × {item.product.name} ({item.size})</span>
                  <span>{formatPrice(item.line_total)}</span>
                </li>
              ))}
            </ul>
            <OrderTotals subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} />
          </div>
        </div>
      </div>
    </div>
  );
}