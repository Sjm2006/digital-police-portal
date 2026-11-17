const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}) {
  const centered = align === 'center';

  return (
    <div className={cx('max-w-2xl', centered && 'mx-auto text-center', className)}>
      <span className={cx('mb-3 block h-0.5 w-8 bg-gold-500', centered && 'mx-auto')} aria-hidden="true" />
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-gold-800">{eyebrow}</p>}
      <Tag id={id} className="mt-1 text-2xl font-bold tracking-tight text-brand-800 sm:text-3xl">
        {title}
      </Tag>
      {description && <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}