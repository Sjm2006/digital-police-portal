const cx = (...classes) => classes.filter(Boolean).join(' ');

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export default function Card({
  as: Tag = 'div',
  title,
  description,
  action,
  footer,
  padding = 'md',
  hoverable = false,
  className,
  bodyClassName,
  children,
  ...rest
}) {
  const hasHeader = Boolean(title || description || action);

  return (
    <Tag
      className={cx(
        'rounded border border-slate-200 bg-white shadow-card',
        hoverable && 'transition-shadow duration-150 hover:shadow-md',
        className
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-navy-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children !== undefined && children !== null && (
        <div className={cx(PADDING[padding] ?? PADDING.md, bodyClassName)}>{children}</div>
      )}

      {footer && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">{footer}</div>
      )}
    </Tag>
  );
}