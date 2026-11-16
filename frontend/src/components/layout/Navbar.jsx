import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import Button from '../ui/Button';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

const PORTAL_LINKS = [
  { label: 'Citizen Portal', to: '/citizen/dashboard' },
  { label: 'Officer Portal', to: '/officer/dashboard' },
  { label: 'Admin Portal', to: '/admin/dashboard' },
];

const MOBILE_MENU_ID = 'public-mobile-menu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-navy-800 bg-navy-900 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded bg-gold-500 text-navy-900">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight">Digital Police Portal</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden h-full items-stretch gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex items-center border-b-2 px-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  isActive
                    ? 'border-gold-500 text-white'
                    : 'border-transparent text-slate-300 hover:text-white'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to="/citizen/dashboard"
            variant="accent"
            size="sm"
            className="hidden md:inline-flex"
          >
            Citizen Portal
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            className="rounded p-2 text-slate-200 transition-colors hover:bg-navy-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id={MOBILE_MENU_ID} className="border-t border-navy-800 bg-navy-900 md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block rounded border-l-2 px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'border-gold-500 bg-navy-800 text-white'
                          : 'border-transparent text-slate-300 hover:bg-navy-800 hover:text-white'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Portal previews (placeholders)
            </p>
            <ul className="mt-2 space-y-1">
              {PORTAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-navy-800 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}