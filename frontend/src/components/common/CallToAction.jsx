const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function CallToAction({ id, title, description, children, className }) {
  return (
    <section
      aria-labelledby={id}
      className={cx('rounded border border-brand-100 bg-brand-50 px-6 py-10 text-center sm:px-10', className)}
    >
      <h2 id={id} className="text-2xl font-bold tracking-tight text-brand-800 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700">{description}</p>
      )}
      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
    </section>
  );
}