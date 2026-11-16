import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * items: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Users' }]
 */
export default function Breadcrumb({ items = [], className }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="rounded transition-colors hover:text-navy-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-slate-800' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}