import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  PlusCircle,
  Eye,
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import apiClient from '../../services/apiClient';

const STATS_CONFIG = [
  { label: 'Total Complaints', icon: FileText, tone: 'bg-blue-50 text-blue-600' },
  { label: 'In Progress', icon: Clock, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Resolved', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Rejected', icon: XCircle, tone: 'bg-rose-50 text-rose-600' },
];

function getStatusLabel(status) {
  return (status || 'SUBMITTED')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusStyle(status) {
  switch (status) {
    case 'RESOLVED':
    case 'CLOSED':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'INVESTIGATION_IN_PROGRESS':
    case 'UNDER_REVIEW':
    case 'ASSIGNED':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-200';
  }
}

function formatDate(date) {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CitizenDashboard() {
  usePageTitle('Citizen Dashboard');

  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await apiClient.get('/citizen/complaints.php');
        setComplaints(response.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load your complaints.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  const stats = useMemo(() => {
    return [
      complaints.length,
      complaints.filter((c) =>
        [
          'SUBMITTED',
          'UNDER_REVIEW',
          'ASSIGNED',
          'INVESTIGATION_IN_PROGRESS',
        ].includes(c.status)
      ).length,
      complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status))
        .length,
      complaints.filter((c) => c.status === 'REJECTED').length,
    ];
  }, [complaints]);

  const filteredComplaints = complaints.filter((c) =>
    `${c.complaint_ref} ${c.subject} ${c.category_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Citizen Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage your submitted complaints.
          </p>
        </div>

        <Link
          to="/citizen/complaints"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <PlusCircle size={16} />
          Register New Complaint
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {loading ? '—' : stats[index]}
                </p>
              </div>

              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.tone}`}
              >
                <stat.icon className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Complaints table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <h2 className="text-sm font-semibold text-slate-900">
            My Recent Complaints
          </h2>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-64"
            />
          </div>
        </div>

        {error && (
          <div className="border-b border-rose-100 bg-rose-50/50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading complaints...
          </div>
        ) : (
          !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Reference</th>
                    <th className="px-4 py-2.5 font-semibold">Subject</th>
                    <th className="px-4 py-2.5 font-semibold">Submitted</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {complaint.complaint_ref}
                        </td>

                        <td className="px-4 py-3">
                          <p className="text-slate-800">
                            {complaint.subject}
                          </p>
                          <p className="text-xs text-slate-500">
                            {complaint.category_name}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(complaint.submitted_at)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${getStatusStyle(
                              complaint.status
                            )}`}
                          >
                            {getStatusLabel(complaint.status)}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <Link
                            to="/citizen/complaints"
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            <Eye size={13} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        {complaints.length === 0
                          ? 'You have not submitted any complaints yet.'
                          : 'No complaints match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}