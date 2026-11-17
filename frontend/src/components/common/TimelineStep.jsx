const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function TimelineStep({ number, title, description, detail, icon: Icon, isLast = false }) {
  return (
    <li className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
          aria-hidden="true"
        >
          {number}
        </span>
        {!isLast && <span className="mt-2 w-px flex-1 bg-line" aria-hidden="true" />}
      </div>

      <div className={cx('min-w-0 flex-1', !isLast && 'pb-8')}>
        <div className="rounded border border-line bg-white p-5 shadow-card sm:p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-brand-800 sm:text-lg">
            <span className="sr-only">Step {number}: </span>
            {title}
            {Icon && <Icon className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{description}</p>
          {detail && (
            <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-ink">In plain words: </span>
              {detail}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}