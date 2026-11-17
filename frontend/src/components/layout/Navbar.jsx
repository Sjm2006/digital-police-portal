import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogIn, Menu, Shield, UserPlus, X } from 'lucide-react';
import Button from '../ui/Button';
import { AUTH_LINKS, MAIN_NAV, SITE_NAME } from '../../constants/site';

const cx = (...classes) => classes.filter(Boolean).join(' ');

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
    <header className="sticky top-0 z-30 border-b border-t-2 border-line border-t-gold-500 bg-white text-ink">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded bg-brand-600 text-white">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-brand-800">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden h-full items-stretch gap-5 lg:flex xl:gap-7">
          {MAIN_NAV.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex items-center whitespace-nowrap border-b-2 px-0.5 text-sm font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-600 hover:border-line hover:text-brand-700'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Button as={Link} to={AUTH_LINKS.login} variant="secondary" size="sm" leftIcon={LogIn}>
              Login
            </Button>
            <Button as={Link} to={AUTH_LINKS.register} variant="primary" size="sm" leftIcon={UserPlus}>
              Register
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            className="rounded p-2 text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden"
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
        <div id={MOBILE_MENU_ID} className="border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="space-y-1">
              {MAIN_NAV.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block rounded border-l-2 px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'border-gold-500 bg-brand-50 text-brand-700'
                          : 'border-transparent text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <Button as={Link} to={AUTH_LINKS.login} variant="secondary" leftIcon={LogIn} fullWidth>
                Login
              </Button>
              <Button as={Link} to={AUTH_LINKS.register} variant="primary" leftIcon={UserPlus} fullWidth>
                Register
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}