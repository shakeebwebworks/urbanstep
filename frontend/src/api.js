// All communication with the Django API happens in this file.

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

async function request(url, options = {}) {
  const opts = { headers: { Accept: 'application/json' }, ...options };
  if (opts.method && opts.method !== 'GET') {
    // Make sure Django has given us the CSRF cookie before we POST
    if (!getCookie('csrftoken')) await fetch('/api/cart/');
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['X-CSRFToken'] = getCookie('csrftoken'); // Django's CSRF protection
  }
  const res = await fetch(url, opts);
  let data = null;
  try { data = await res.json(); } catch { /* response had no JSON body */ }

  if (!res.ok) {
    const err = new Error((data && data.error) || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.fieldErrors = data && data.errors;
    throw err;
  }
  return data;
}

const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });

export function getProducts(params = {}) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
  return request('/api/products/?' + new URLSearchParams(clean));
}
export const getProduct = (id) => request(`/api/products/${id}/`);
export const getCart = () => request('/api/cart/');
export const addToCart = (id, size, qty) => post('/api/cart/add/', { id, size, qty });
export const updateCart = (id, size, qty) => post('/api/cart/update/', { id, size, qty });
export const removeFromCart = (id, size) => post('/api/cart/remove/', { id, size });
export const checkout = (form) => post('/api/checkout/', form);