
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock3,
  Search,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CalendarDays,
} from 'lucide-react';

import apiClient from '../../services/apiClient';

const STAT_CARDS = [
  {
    key: 'total_assigned',
    label: 'Assigned Complaints',
    icon: ClipboardList,
    color: 'blue',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock3,
    color: 'amber',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: Search,
    color: 'indigo',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'emerald',
  },
];

const COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatStatus(status) {
  return (status || 'UNKNOWN')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }) {
  const styles = {
    SUBMITTED: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-sky-100 text-sky-700',
    UNDER_REVIEW: 'bg-amber-100 text-amber-700',
    INVESTIGATION_IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

export default function OfficerDashboard() {
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/officer/dashboard.php');

      const result = response.data?.data ?? response.data;

      setStats(result?.stats || {});
      setComplaints(result?.recent_complaints || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load dashboard information.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-7">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Officer Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your assigned complaints and investigation progress.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {loading
                      ? '—'
                      : Number(stats[card.key] || 0).toLocaleString('en-IN')}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${COLOR_CLASSES[card.color]}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent complaints */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Complaints
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your five most recently updated assigned complaints.
            </p>
          </div>

          <Link
            to="/officer/complaints"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList
              size={38}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              No assigned complaints
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Assigned complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Complaint ID</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Citizen</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Updated</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-700">
                      {complaint.complaint_ref}
                    </td>

                    <td className="min-w-48 px-5 py-4 font-medium text-slate-800">
                      {complaint.subject}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {complaint.citizen_name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {complaint.category_name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} />
                        {formatDate(complaint.updated_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

    </div>
  );
}
