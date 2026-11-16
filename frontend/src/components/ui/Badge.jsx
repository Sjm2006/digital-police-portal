const cx = (...classes) => classes.filter(Boolean).join(' ');

const VARIANTS = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  navy: 'bg-navy-50 text-navy-800 ring-navy-100',
  gold: 'bg-gold-50 text-gold-800 ring-gold-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
};

const DOTS = {
  neutral: 'bg-slate-500',
  navy: 'bg-navy-700',
  gold: 'bg-gold-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  danger: 'bg-red-600',
  info: 'bg-sky-600',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...rest
}) {
  const variantKey = VARIANTS[variant] ? variant : 'neutral';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        VARIANTS[variantKey],
        SIZES[size] ?? SIZES.md,
        className
      )}
      {...rest}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', DOTS[variantKey])} aria-hidden="true" />}
      {children}
    </span>
  );
}