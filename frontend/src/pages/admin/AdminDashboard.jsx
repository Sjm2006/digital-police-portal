import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Users, UserCog, FileText, Clock3, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const STAT_CARDS = [
  { key: 'citizens', label: 'Active Citizens', icon: Users, color: 'blue' },
  { key: 'officers', label: 'Active Officers', icon: UserCog, color: 'violet' },
  { key: 'total', label: 'Total Complaints', icon: FileText, color: 'slate' },
  { key: 'submitted', label: 'Submitted', icon: Clock3, color: 'amber' },
  { key: 'investigation_in_progress', label: 'Under Investigation', icon: AlertCircle, color: 'orange' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'green' },
];

const COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  green: 'bg-green-50 text-green-700',
};

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  investigation_in_progress: 'Investigation',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
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
  const styles = {
    submitted: 'bg-blue-50 text-blue-700',
    under_review: 'bg-amber-50 text-amber-700',
    assigned: 'bg-violet-50 text-violet-700',
    investigation_in_progress: 'bg-orange-50 text-orange-700',
    resolved: 'bg-green-50 text-green-700',
    closed: 'bg-slate-100 text-slate-700',
    rejected: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[key] || 'bg-slate-100 text-slate-700'}`}>
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
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
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={loadDashboard} className="ml-2 font-bold underline">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {STAT_CARDS.map(({ key, label, icon: Icon, color }) => {
              const value =
                key === 'citizens' ? users.citizens :
                key === 'officers' ? users.officers :
                complaints[key];

              return (
                <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <span className={`rounded-lg p-2.5 ${COLOR_CLASSES[color]}`}>
                      <Icon size={19} />
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-slate-900">
                    {Number(value || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
              <h2 className="text-base font-bold text-slate-900">Complaint Overview</h2>
              <p className="mt-1 text-sm text-slate-500">Current distribution by status</p>

              <div className="mt-5 space-y-4">
                {statusKeys.map((key) => {
                  const count = Number(complaints[key] || 0);
                  const total = Number(complaints.total || 0);
                  const percentage = total ? (count / total) * 100 : 0;

                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex justify-between gap-2 text-sm">
                        <span className="text-slate-600">{STATUS_LABELS[key]}</span>
                        <span className="font-semibold text-slate-900">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest five submissions</p>
                </div>
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                  {pending} active / pending
                </div>
              </div>

              {recent.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No complaints have been submitted yet.
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                        <th className="pb-3 pr-4 font-semibold">Reference</th>
                        <th className="pb-3 pr-4 font-semibold">Complaint</th>
                        <th className="pb-3 pr-4 font-semibold">Citizen</th>
                        <th className="pb-3 pr-4 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((item) => (
                        <tr key={item.complaint_ref} className="border-b border-slate-100 last:border-0">
                          <td className="py-4 pr-4 font-semibold text-blue-700">
                            {item.complaint_ref}
                          </td>
                          <td className="max-w-[180px] py-4 pr-4">
                            <p className="truncate font-medium text-slate-800">{item.subject}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.category_name}</p>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">{item.citizen_name}</td>
                          <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                            {formatDate(item.submitted_at)}
                          </td>
                          <td className="py-4"><StatusBadge status={item.status} /></td>
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
