import { Loader2 } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export default function Loading({
  label = 'Loading...',
  size = 'md',
  showLabel = true,
  fullScreen = false,
  className,
}) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className={cx('flex flex-col items-center justify-center gap-3 text-navy-800', !fullScreen && 'py-10', className)}
    >
      <Loader2 className={cx(SIZES[size] ?? SIZES.md, 'animate-spin')} aria-hidden="true" />
      <span className={cx('text-sm font-medium text-slate-600', !showLabel && 'sr-only')}>{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">{content}</div>;
  }

  return content;
}