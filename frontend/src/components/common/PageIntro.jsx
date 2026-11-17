export default function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <span className="mb-3 block h-0.5 w-8 bg-gold-500" aria-hidden="true" />
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-gold-800">{eyebrow}</p>}
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}