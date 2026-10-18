import { useState } from 'react';

// Shows the product photo. If there is no photo (or it fails to load),
// it shows a clean neutral tile with the product name instead.
export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false);
  const alt = `${product.name} – ${product.category}`;

  if (product.image && !failed) {
    // Local files like "images/aero.jpg" get the right prefix; full URLs are used as-is.
    const src = product.image.startsWith('http')
      ? product.image
      : `${import.meta.env.BASE_URL}${product.image.replace(/^\//, '')}`;
    return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)}
                className={`product-img ${className}`} />;
  }
  return (
    <div className={`product-img placeholder ${className}`} role="img" aria-label={alt}>
      <span>{product.name}</span>
    </div>
  );
}