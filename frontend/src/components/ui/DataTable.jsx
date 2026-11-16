const cx = (...classes) => classes.filter(Boolean).join(' ');

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * columns: [{ key, header, align?, className?, render?: (row, index) => node }]
 * data:    array of row objects
 * rowKey:  field name, or (row, index) => unique key
 */
export default function DataTable({
  columns = [],
  data = [],
  rowKey = 'id',
  isLoading = false,
  emptyMessage = 'No records to display.',
  caption,
  skeletonRows = 5,
  className,
}) {
  const getKey = (row, index) =>
    typeof rowKey === 'function' ? rowKey(row, index) : (row?.[rowKey] ?? index);

  const renderCell = (column, row, index) =>
    column.render ? column.render(row, index) : row?.[column.key];

  return (
    <div className={cx('w-full overflow-hidden rounded border border-slate-200 bg-white shadow-card', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm" aria-busy={isLoading || undefined}>
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cx(
                    'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600',
                    ALIGN[column.align] ?? ALIGN.left,
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <div className="h-4 w-full max-w-[10rem] animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="px-4 py-10 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row, rowIndex) => (
                <tr key={getKey(row, rowIndex)} className="transition-colors hover:bg-slate-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx(
                        'px-4 py-3 text-slate-700',
                        ALIGN[column.align] ?? ALIGN.left,
                        column.className
                      )}
                    >
                      {renderCell(column, row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}