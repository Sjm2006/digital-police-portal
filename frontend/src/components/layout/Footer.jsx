import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { AUTH_LINKS, EMERGENCY_NUMBER, FOOTER_SERVICES, MAIN_NAV, PREVIEW_LINKS, SITE_NAME } from '../../constants/site';

const LINK_CLASS =
  'rounded text-sm text-slate-700 transition-colors hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

const HEADING_CLASS = 'text-xs font-semibold uppercase tracking-wide text-brand-700';

const NAVIGATION_LINKS = MAIN_NAV.filter((link) => ['/', '/about', '/services', '/how-it-works'].includes(link.to));

const SUPPORT_LINKS = [
  MAIN_NAV.find((link) => link.to === '/faq'),
  MAIN_NAV.find((link) => link.to === '/contact'),
  { label: 'Login', to: AUTH_LINKS.login },
  { label: 'Register', to: AUTH_LINKS.register },
].filter(Boolean);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-brand-50 text-slate-700">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-brand-600 text-white">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight text-brand-800">{SITE_NAME}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-700">
            A digital platform concept for simpler complaint registration, clearer status information and better
            organised complaint records.
          </p>

          <div className="mt-6 max-w-sm rounded border border-l-4 border-line border-l-gold-500 bg-white p-4">
            <p className="text-sm font-semibold text-ink">Emergency Assistance: {EMERGENCY_NUMBER}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              This portal is an educational prototype. In an emergency, contact {EMERGENCY_NUMBER} instead.
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="lg:col-span-2">
          <h2 className={HEADING_CLASS}>Navigation</h2>
          <ul className="mt-4 space-y-2.5">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services" className="lg:col-span-3">
          <h2 className={HEADING_CLASS}>Planned services</h2>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_SERVICES.map((service) => (
              <li key={service}>
                <Link to="/services" className={LINK_CLASS}>
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer support" className="lg:col-span-3">
          <h2 className={HEADING_CLASS}>Support and access</h2>
          <ul className="mt-4 space-y-2.5">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p>
            &copy; {year} {SITE_NAME}. Educational software prototype. Not affiliated with, operated by or authorised
            by any government or police department.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Development previews:</span>
            {PREVIEW_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded underline underline-offset-2 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {link.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}