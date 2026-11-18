import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';
import AshokaMark from '../common/AshokaMark';
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

  const linkClass = ({ isActive }) =>
    cx(
      'flex items-center whitespace-nowrap border-b-[3px] px-1 text-sm font-semibold transition-colors',
      isActive
        ? 'border-[#E87519] text-white'
        : 'border-transparent text-blue-100 hover:border-[#E87519] hover:text-white'
    );

  return (
    <header className="sticky top-0 z-50 border-t-4 border-[#E87519] bg-[#183B63] text-white shadow-lg">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
          aria-label={`${SITE_NAME} home`}
        >
          <AshokaMark size={53} light />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-wide text-white sm:text-base">
              DIGITAL POLICE
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.2em] text-[#F5A623] sm:text-xs">
              {SITE_NAME === 'Digital Police Portal' ? 'CITIZEN SERVICE PORTAL' : SITE_NAME}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden h-[76px] items-stretch gap-5 lg:flex xl:gap-7"
        >
          {MAIN_NAV.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to={AUTH_LINKS.login}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <LogIn size={17} />
              Login
            </Link>
            <Link
              to={AUTH_LINKS.register}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E87519] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#CF5F0D]"
            >
              <UserPlus size={17} />
              Register
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] lg:hidden"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id={MOBILE_MENU_ID} className="border-t border-white/15 bg-[#183B63] lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="space-y-1">
              {MAIN_NAV.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block rounded-lg border-l-4 px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'border-[#E87519] bg-white/10 text-white'
                          : 'border-transparent text-blue-100 hover:bg-white/10 hover:text-white'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
              <Link
                to={AUTH_LINKS.login}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-3 py-3 text-sm font-semibold text-white"
              >
                <LogIn size={17} />
                Login
              </Link>
              <Link
                to={AUTH_LINKS.register}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#E87519] px-3 py-3 text-sm font-bold text-white"
              >
                <UserPlus size={17} />
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
