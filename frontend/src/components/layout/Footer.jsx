import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

const PORTAL_LINKS = [
  { label: 'Citizen Dashboard', to: '/citizen/dashboard' },
  { label: 'Officer Dashboard', to: '/officer/dashboard' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
];

const LINK_CLASS =
  'rounded text-sm text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-gold-500 text-navy-900">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight">Digital Police Portal</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
            An educational college project demonstrating a digital complaint management platform. It is not an
            official government or police service. Please do not use it to report real emergencies; contact your
            local emergency services instead.
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gold-400">Quick links</h2>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer portal previews">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gold-400">Portal previews</h2>
          <ul className="mt-4 space-y-2.5">
            {PORTAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-navy-800">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          &copy; {year} Digital Police Portal. College project for educational purposes only.
        </p>
      </div>
    </footer>
  );
}