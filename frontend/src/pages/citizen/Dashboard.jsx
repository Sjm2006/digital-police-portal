
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
  { label: 'Total Complaints', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'In Progress', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Resolved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
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
      return 'bg-green-100 text-green-800';
    case 'INVESTIGATION_IN_PROGRESS':
    case 'UNDER_REVIEW':
    case 'ASSIGNED':
      return 'bg-indigo-100 text-indigo-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
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
          err.response?.data?.message ||
          'Unable to load your complaints.'
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
        ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'INVESTIGATION_IN_PROGRESS']
          .includes(c.status)
      ).length,
      complaints.filter((c) =>
        ['RESOLVED', 'CLOSED'].includes(c.status)
      ).length,
      complaints.filter((c) => c.status === 'REJECTED').length,
    ];
  }, [complaints]);

  const filteredComplaints = complaints.filter((c) =>
    `${c.complaint_ref} ${c.subject} ${c.category_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Citizen Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage your submitted complaints.
          </p>
        </div>

        <Link
          to="/citizen/complaints"
          className="inline-flex items-center justify-center gap-2 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <PlusCircle className="h-4 w-4" />
          Register New Complaint
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {loading ? '—' : stats[index]}
                </p>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            My Recent Complaints
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none sm:w-64"
            />
          </div>
        </div>

        {error && (
          <div className="p-5 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading complaints...
          </div>
        ) : !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {complaint.complaint_ref}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">
                          {complaint.subject}
                        </p>
                        <p className="text-xs text-slate-500">
                          {complaint.category_name}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(complaint.submitted_at)}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(complaint.status)}`}>
                          {getStatusLabel(complaint.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/citizen/complaints"
                          className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      {complaints.length === 0
                        ? 'You have not submitted any complaints yet.'
                        : 'No complaints match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
