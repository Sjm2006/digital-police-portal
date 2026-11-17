import Badge from '../ui/Badge';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  headingLevel: Heading = 'h3',
  className,
}) {
  return (
    <article className={cx('flex h-full flex-col rounded border border-line bg-white p-6 shadow-card', className)}>
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-brand-50 text-brand-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        {badge && (
          <Badge variant="gold" size="sm">
            {badge}
          </Badge>
        )}
      </div>
      <Heading className="mt-4 text-base font-semibold text-brand-800">{title}</Heading>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
}