import { useEffect, useState } from 'react';
import Icon from './Icon';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    <Icon name="up" size={20} />
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button type="button" className={`back-top ${show ? 'show' : ''}`} aria-label="Back to top"
            tabIndex={show ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      ↑
    </button>
  );
}