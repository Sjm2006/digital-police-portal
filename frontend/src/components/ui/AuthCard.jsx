const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function AuthCard({ title, description, children, footer, className }) {
  return (
    <section className={cx('rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7', className)}>
      {(title || description) && (
        <header className="mb-5">
          {title && <h2 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h2>}
          {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>}
        </header>
      )}

      {children}

      {footer && <div className="mt-5 border-t border-line pt-4 text-sm text-slate-600">{footer}</div>}
    </section>
  );
}
