const cx = (...classes) => classes.filter(Boolean).join(' ');

const STYLES = {
  error: 'border-danger/20 bg-danger/5 text-danger',
  success: 'border-success/20 bg-success/5 text-success',
  info: 'border-info/20 bg-info/5 text-info',
};

export default function FormMessage({ children, variant = 'info', className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx('rounded border px-3 py-2.5 text-sm font-medium', STYLES[variant] ?? STYLES.info, className)}
    >
      {children}
    </div>
  );
}
