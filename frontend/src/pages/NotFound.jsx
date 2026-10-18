import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils';
import Button from '../components/Button';

export default function NotFound() {
  usePageMeta('Page not found', 'The page you are looking for does not exist.');
  return (
    <div className="container section">
      <div className="empty-state">
        <p className="display-1 fw-bold mb-0" style={{ color: 'var(--brand-text)' }}>404</p>
        <h1 className="h2">Page not found</h1>
        <p className="text-muted">Looks like this step doesn't lead anywhere.</p>
        <Button as={Link} to="/" className="btn-brand">Back to home</Button>
      </div>
    </div>
  );
}