import { useEffect } from 'react';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (n) => money.format(n);

// Sets the browser tab title and meta description for each page (SEO).
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | UrbanStep` : 'UrbanStep – Fashion & Sneakers';
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}