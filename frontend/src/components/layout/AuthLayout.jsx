import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { SITE_NAME } from '../../constants/site';

const FEATURE_ITEMS = [
  'Secure sign in for citizens, officers and administrators.',
  'Responsive access across desktop and mobile devices.',
  'Prepared for PHP session-based identity checks in later phases.',
];

export default function AuthLayout({ title, subtitle, children, backLink = '/' }) {
  return (
    <div className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to home
          </Link>

          <div className="flex items-center gap-2.5 text-brand-800">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-brand-600 text-white shadow-sm">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-wide">{SITE_NAME}</span>
          </div>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Secure access</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-600">{subtitle}</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {FEATURE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <span className="block h-2 w-2 rounded-full bg-brand-600" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
