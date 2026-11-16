import { Link } from 'react-router-dom';
import { Home, Menu } from 'lucide-react';
import Badge from '../ui/Badge';

export default function DashboardHeader({ sectionLabel, onMenuClick, isMenuOpen = false, menuControlsId }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls={menuControlsId}
          className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="truncate text-sm font-semibold text-navy-900">{sectionLabel}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Badge variant="gold" dot className="hidden sm:inline-flex">
          Preview mode
        </Badge>
        <Link
          to="/"
          aria-label="Back to public site"
          className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Public site</span>
        </Link>
      </div>
    </header>
  );
}