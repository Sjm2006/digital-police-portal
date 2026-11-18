import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw,
  Users,
  UserCog,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import apiClient from '../../services/apiClient';

const STAT_CARDS = [
  { key: 'citizens', label: 'Active Citizens', icon: Users, tone: 'text-blue-600 bg-blue-50' },
  { key: 'officers', label: 'Active Officers', icon: UserCog, tone: 'text-violet-600 bg-violet-50' },
  { key: 'total', label: 'Total Complaints', icon: FileText, tone: 'text-slate-600 bg-slate-100' },
  { key: 'submitted', label: 'Submitted', icon: Clock3, tone: 'text-amber-600 bg-amber-50' },
  { key: 'investigation_in_progress', label: 'Under Investigation', icon: AlertCircle, tone: 'text-orange-600 bg-orange-50' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
];

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  investigation_in_progress: 'Investigation',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
};

const STATUS_STYLES = {
  submitted: 'bg-blue-50 text-blue-700 ring-blue-200',
  under_review: 'bg-amber-50 text-amber-700 ring-amber-200',
  assigned: 'bg-violet-50 text-violet-700 ring-violet-200',
  investigation_in_progress: 'bg-orange-50 text-orange-700 ring-orange-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const BAR_COLORS = {
  submitted: 'bg-blue-500',
  under_review: 'bg-amber-500',
  assigned: 'bg-violet-500',
  investigation_in_progress: 'bg-orange-500',
  resolved: 'bg-emerald-500',
  closed: 'bg-slate-400',
  rejected: 'bg-rose-500',
};

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
}

function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
        STATUS_STYLES[key] || 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      {STATUS_LABELS[key] || status || 'Unknown'}
    </span>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/admin/dashboard.php');
      const result = response.data?.data ?? response.data;
      setDashboard(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load dashboard data. Please check the backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const complaints = dashboard?.complaints || {};
  const users = dashboard?.users || {};
  const recent = dashboard?.recent_complaints || [];

  const pending =
    (complaints.submitted || 0) +
    (complaints.under_review || 0) +
    (complaints.assigned || 0) +
    (complaints.investigation_in_progress || 0);

  const statusKeys = [
    'submitted',
    'under_review',
    'assigned',
    'investigation_in_progress',
    'resolved',
    'closed',
    'rejected',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Administration
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor portal activity and complaint progress.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          {error}
          <button
            onClick={loadDashboard}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !dashboard ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading dashboard statistics...
        </div>
      ) : dashboard ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {STAT_CARDS.map(({ key, label, icon: Icon, tone }) => {
              const value =
                key === 'citizens'
                  ? users.citizens
                  : key === 'officers'
                  ? users.officers
                  : complaints[key];

              return (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">
                      {label}
                    </p>
                    <span className={`rounded-lg p-1.5 ${tone}`}>
                      <Icon size={15} />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {Number(value || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* Complaint Overview */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs xl:col-span-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Complaint Overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Current distribution by status
              </p>

              <div className="mt-4 space-y-3">
                {statusKeys.map((key) => {
                  const count = Number(complaints[key] || 0);
                  const total = Number(complaints.total || 0);
                  const percentage = total ? (count / total) * 100 : 0;

                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between gap-2 text-xs">
                        <span className="text-slate-600">
                          {STATUS_LABELS[key]}
                        </span>
                        <span className="font-medium text-slate-900">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${BAR_COLORS[key]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Complaints */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-xs xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Recent Complaints
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Latest five submissions
                  </p>
                </div>
                <div className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                  {pending} pending
                </div>
              </div>

              {recent.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No complaints have been submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left text-sm">
                    <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Reference</th>
                        <th className="px-4 py-2.5 font-semibold">Complaint</th>
                        <th className="px-4 py-2.5 font-semibold">Citizen</th>
                        <th className="px-4 py-2.5 font-semibold">Date</th>
                        <th className="px-4 py-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recent.map((item) => (
                        <tr
                          key={item.complaint_ref}
                          className="transition-colors hover:bg-slate-50/60"
                        >
                          <td className="px-4 py-3 font-medium text-blue-700">
                            {item.complaint_ref}
                          </td>
                          <td className="max-w-[180px] px-4 py-3">
                            <p className="truncate text-slate-800">
                              {item.subject}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {item.category_name}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.citizen_name}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                            {formatDate(item.submitted_at)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}