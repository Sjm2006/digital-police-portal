
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  HeartHandshake,
  Landmark,
  LogIn,
  Menu,
  Phone,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';

import Button from '../ui/Button';
import { AUTH_LINKS, MAIN_NAV, SITE_NAME } from '../../constants/site';

const cx = (...classes) => classes.filter(Boolean).join(' ');
const MOBILE_MENU_ID = 'public-mobile-menu';

const HELPLINES = [
  { number: '112', label: 'National Emergency', icon: AlertCircle },
  { number: '1930', label: 'Cyber Financial Fraud', icon: ShieldCheck },
  { number: '181', label: "Women's Helpline", icon: HeartHandshake },
  { number: '1098', label: 'Child Helpline', icon: Phone },
];

function HelplineTicker() {
  const items = [...HELPLINES, ...HELPLINES];

  return (
    <div
      className="helpline-strip"
      aria-label="Important national helpline numbers"
    >
      <div className="helpline-inner">
        <div className="helpline-label">
          <span className="helpline-live-dot" />
          <span>PUBLIC HELPLINES</span>
        </div>

        <div className="helpline-viewport">
          <div className="helpline-track">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={`${item.number}-${index}`}
                  href={`tel:${item.number}`}
                  className="helpline-item"
                  tabIndex={index >= HELPLINES.length ? -1 : 0}
                  aria-hidden={index >= HELPLINES.length}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="helpline-number">{item.number}</span>
                  <span className="helpline-description">{item.label}</span>
                  <span className="helpline-separator" aria-hidden="true">
                    ◆
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-t-[4px] border-[#E87519]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87519]"
            aria-label={`${SITE_NAME} home`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#183B63] text-white shadow-md">
              <Landmark className="h-6 w-6" aria-hidden="true" />
            </span>

            <span className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[#183B63] sm:text-lg">
                {SITE_NAME}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E87519] sm:text-[11px]">
                Citizen Service Portal
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
                className={({ isActive }) =>
                  cx(
                    'flex items-center whitespace-nowrap border-b-[3px] px-0.5 pt-[3px] text-sm font-semibold transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87519]',
                    isActive
                      ? 'border-[#E87519] text-[#E87519]'
                      : 'border-transparent text-[#40536B] hover:border-[#E87519] hover:text-[#183B63]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                as={Link}
                to={AUTH_LINKS.login}
                variant="secondary"
                size="sm"
                leftIcon={LogIn}
              >
                Login
              </Button>

              <Button
                as={Link}
                to={AUTH_LINKS.register}
                variant="primary"
                size="sm"
                leftIcon={UserPlus}
              >
                Register
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              className="rounded-lg p-2 text-[#183B63] transition-colors hover:bg-[#FFF3E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87519] lg:hidden"
            >
              {menuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div id={MOBILE_MENU_ID} className="border-t border-slate-200 bg-white lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
          >
            <ul className="space-y-1">
              {MAIN_NAV.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block rounded-lg border-l-[3px] px-3 py-3 text-sm font-semibold transition-colors',
                        isActive
                          ? 'border-[#E87519] bg-[#FFF3E8] text-[#183B63]'
                          : 'border-transparent text-slate-700 hover:bg-slate-50'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              <Button
                as={Link}
                to={AUTH_LINKS.login}
                variant="secondary"
                leftIcon={LogIn}
                fullWidth
              >
                Login
              </Button>

              <Button
                as={Link}
                to={AUTH_LINKS.register}
                variant="primary"
                leftIcon={UserPlus}
                fullWidth
              >
                Register
              </Button>
            </div>
          </nav>
        </div>
      )}

      <HelplineTicker />
    </header>
  );
}
