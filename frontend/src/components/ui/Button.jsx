import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const BASE =
  'inline-flex items-center justify-center rounded font-semibold transition-colors duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none whitespace-nowrap';

const VARIANTS = {
  primary:
    'border border-transparent bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-navy-700',
  accent:
    'border border-transparent bg-gold-500 text-navy-900 hover:bg-gold-600 focus-visible:ring-gold-500',
  secondary:
    'border border-slate-300 bg-white text-navy-800 hover:bg-slate-50 focus-visible:ring-navy-700',
  ghost:
    'border border-transparent bg-transparent text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-700',
  danger:
    'border border-transparent bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-600',
};

const SIZES = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    children,
    ...rest
  },
  ref
) {
  const isNativeButton = Component === 'button';
  const isDisabled = disabled || loading;
  const iconSize = ICON_SIZES[size] ?? ICON_SIZES.md;

  const stateProps = isNativeButton
    ? { type, disabled: isDisabled }
    : { 'aria-disabled': isDisabled || undefined };

  return (
    <Component
      ref={ref}
      {...stateProps}
      aria-busy={loading || undefined}
      className={cx(
        BASE,
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth && 'w-full',
        isDisabled && 'pointer-events-none opacity-60',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className={cx(iconSize, 'animate-spin')} aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className={iconSize} aria-hidden="true" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon className={iconSize} aria-hidden="true" />}
    </Component>
  );
});

export default Button;