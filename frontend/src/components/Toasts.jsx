import { useStore } from '../context/StoreContext';
import Icon from './Icon';
// aria-live makes screen readers announce new toasts.
export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <Icon name={t.type === 'error' ? 'alert' : 'check'} size={18} />
          {t.message}
        </div>
      ))}
    </div>
  );
}