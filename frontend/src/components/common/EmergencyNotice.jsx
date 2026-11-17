import { PhoneCall } from 'lucide-react';
import { EMERGENCY_NUMBER } from '../../constants/site';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_MESSAGE = `This portal is an educational prototype and must not be used to report emergencies. In an emergency, contact ${EMERGENCY_NUMBER} immediately.`;

export default function EmergencyNotice({
  title = `Emergency Assistance: ${EMERGENCY_NUMBER}`,
  message = DEFAULT_MESSAGE,
  compact = false,
  className,
}) {
  return (
    <aside
      aria-label="Emergency information"
      className={cx(
        'flex items-start gap-4 rounded border border-l-4 border-gold-200 border-l-gold-500 bg-gold-50',
        compact ? 'p-4' : 'p-5 sm:p-6',
        className
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white text-gold-800 ring-1 ring-gold-200">
        <PhoneCall className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        {compact ? (
          <p className="text-sm font-semibold text-ink">{title}</p>
        ) : (
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
        )}
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{message}</p>
      </div>
    </aside>
  );
}