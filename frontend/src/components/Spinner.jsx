export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border" style={{ color: 'var(--brand-text)' }} />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}