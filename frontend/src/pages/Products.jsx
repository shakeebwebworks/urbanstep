import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import { usePageMeta } from '../utils';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import Icon from '../components/Icon';

export default function Products() {
  usePageMeta('Shop', 'Browse all UrbanStep sneakers, hoodies, jackets and accessories.');

  // Filters live in the URL (?search=&category=&sort=) so pages can be shared and bookmarked.
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const setParam = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      value ? next.set(key, value) : next.delete(key);
      return next;
    }, { replace: true });

  // Debounce: wait 300ms after the user stops typing before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== search) setParam('search', searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Load products whenever a filter changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getProducts({ search, category, sort })
      .then((d) => { if (!cancelled) { setProducts(d.products); setCategories(d.categories); } })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, category, sort]);

  const clearFilters = () => { setSearchInput(''); setParams({}, { replace: true }); };

  return (
    <div className="container section">
      <h1 className="mb-4">Shop all</h1>

      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <label htmlFor="search" className="visually-hidden">Search products</label>
          <input id="search" type="search" className="form-control form-control-lg" placeholder="Search sneakers, hoodies…"
                 value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label htmlFor="sort" className="visually-hidden">Sort by</label>
          <select id="sort" className="form-select form-select-lg" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            <option value="">Featured</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by category">
        <button type="button" className={`pill ${category === '' ? 'active' : ''}`} aria-pressed={category === ''} onClick={() => setParam('category', '')}>All</button>
        {categories.map((c) => (
          <button key={c} type="button" className={`pill ${category === c ? 'active' : ''}`} aria-pressed={category === c} onClick={() => setParam('category', c)}>
            {c}
          </button>
        ))}
      </div>

      <p className="text-muted" aria-live="polite">{!loading && !error && `${products.length} product${products.length === 1 ? '' : 's'}`}</p>

      {error && <p className="text-danger" role="alert">{error}</p>}

      {loading ? <ProductGridSkeleton /> : products.length === 0 && !error ? (
        <div className="empty-state">
          <Icon name="search" size={44} />
          <h2>No results found</h2>
          <p className="text-muted">Try a different search or clear your filters.</p>
          <Button className="btn-brand" onClick={clearFilters}>Clear filters</Button>
        </div>
      ) : (
        <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-xl-4">
          {products.map((p, i) => <div className="col" key={p.id}><ProductCard product={p} index={i} /></div>)}
        </div>
      )}
    </div>
  );
}