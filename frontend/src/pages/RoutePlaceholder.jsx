import { useEffect } from 'react';
import { Wrench } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const SECTIONS = {
  public: { label: 'Home', to: '/' },
  citizen: { label: 'Citizen Portal', to: '/citizen/dashboard' },
  officer: { label: 'Officer Portal', to: '/officer/dashboard' },
  admin: { label: 'Administration', to: '/admin/dashboard' },
};

/**
 * section:      'public' | 'citizen' | 'officer' | 'admin'
 * plannedItems: labels of future dashboard sections (rendered as empty "No data yet" slots)
 * breadcrumbs:  optional override; pass [] to hide breadcrumbs
 */
export default function RoutePlaceholder({
  title,
  description,
  section = 'public',
  expectedPhase,
  plannedItems = [],
  statusLabel = 'Placeholder page',
  heading = 'Content coming soon',
  message,
  icon: Icon = Wrench,
  breadcrumbs,
  actions,
}) {
  const sectionInfo = SECTIONS[section] ?? SECTIONS.public;
  const crumbs = breadcrumbs ?? [{ label: sectionInfo.label, to: sectionInfo.to }, { label: title }];

  useEffect(() => {
    document.title = `${title} | Digital Police Portal`;
  }, [title]);

  const bodyMessage =
    message ??
    (expectedPhase
      ? `The full "${title}" page will be built in ${expectedPhase}. For now, only the layout and navigation are in place.`
      : 'This page is a placeholder. Only the layout and navigation are in place.');

  const content = (
    <>
      <PageHeader title={title} description={description} breadcrumbs={crumbs} actions={actions} />

      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-navy-50 text-navy-800">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <Badge variant="gold" dot>
              {statusLabel}
            </Badge>
            <h2 className="mt-3 text-base font-semibold text-navy-900">{heading}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{bodyMessage}</p>
          </div>
        </div>
      </Card>

      {plannedItems.length > 0 && (
        <section aria-labelledby="planned-sections-heading" className="mt-8">
          <h2 id="planned-sections-heading" className="text-sm font-semibold text-slate-800">
            Planned dashboard sections
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Layout placeholders only. No data is connected yet, so no figures are shown.
          </p>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {plannedItems.map((item) => (
              <li key={item}>
                <Card padding="sm" className="h-full">
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold text-slate-300" aria-hidden="true">
                      --
                    </span>
                    <Badge size="sm">No data yet</Badge>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );

  if (section === 'public') {
    return <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{content}</div>;
  }

  return content;
}