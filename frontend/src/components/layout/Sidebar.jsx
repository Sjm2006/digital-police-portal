import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Shield, X } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * items: [{ label, to, icon }]   (icon is a lucide-react component)
 * title: role label shown under the brand, e.g. "Citizen Portal"
 */
export default function Sidebar({ id, items = [], title, isOpen = false, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id={id}
        aria-label={`${title} navigation`}
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 text-slate-300',
          'transition-[transform,visibility] duration-200',
          'lg:visible lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0',
          isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-navy-800 px-4">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 rounded text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-gold-500 text-navy-900">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate text-sm font-bold tracking-tight">Digital Police Portal</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded p-1.5 text-slate-300 transition-colors hover:bg-navy-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="px-5 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-gold-400">{title}</p>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-1">
            {items.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded border-l-2 px-3 py-2.5 text-sm font-medium transition-colors',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                      isActive
                        ? 'border-gold-500 bg-navy-800 text-white'
                        : 'border-transparent hover:bg-navy-800 hover:text-white'
                    )
                  }
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                  <span className="truncate">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-navy-800 p-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-navy-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
            Back to public site
          </Link>
          <p className="mt-3 px-3 text-xs leading-relaxed text-slate-400">
            Educational project. Not an official police service.
          </p>
        </div>
      </aside>
    </>
  );
}