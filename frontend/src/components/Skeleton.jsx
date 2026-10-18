// Grey shimmering placeholders shown while products load.
export function ProductCardSkeleton() {
  return (
    <div className="product-card" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 0 }} />
      <div className="p-3">
        <div className="skeleton mb-2" style={{ height: 12, width: '40%' }} />
        <div className="skeleton mb-2" style={{ height: 18, width: '80%' }} />
        <div className="skeleton" style={{ height: 16, width: '30%' }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-xl-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div className="col" key={i}><ProductCardSkeleton /></div>
      ))}
    </div>
  );
}