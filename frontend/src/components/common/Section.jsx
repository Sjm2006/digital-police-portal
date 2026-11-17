const cx = (...classes) => classes.filter(Boolean).join(' ');

const TONES = {
  default: '',
  white: 'border-y border-line bg-white',
  tint: 'bg-brand-50',
};

const SPACING = {
  sm: 'py-8',
  md: 'py-12 sm:py-16',
  lg: 'py-16 lg:py-24',
};

export default function Section({ id, tone = 'default', spacing = 'md', labelledBy, className, children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(TONES[tone] ?? TONES.default, className)}>
      <div className={cx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', SPACING[spacing] ?? SPACING.md)}>{children}</div>
    </section>
  );
}