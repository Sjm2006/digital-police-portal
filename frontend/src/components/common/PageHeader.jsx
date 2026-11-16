import Breadcrumb from './Breadcrumb';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function PageHeader({ title, description, breadcrumbs = [], actions, className }) {
  return (
    <header className={cx('mb-6', className)}>
      {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} className="mb-3" />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}