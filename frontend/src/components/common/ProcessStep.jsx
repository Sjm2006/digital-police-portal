const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function ProcessStep({ number, title, description, icon: Icon, className }) {
  return (
    <li className={cx('flex gap-4 rounded border border-line bg-white p-5 shadow-card', className)}>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-base font-semibold text-brand-800">
          <span className="sr-only">Step {number}: </span>
          {title}
          {Icon && <Icon className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </li>
  );
}