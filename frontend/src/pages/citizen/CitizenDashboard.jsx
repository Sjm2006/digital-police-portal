import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Search,
  CheckCircle,
  Plus,
  Bell,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const STATUSES = {
  pending: ['SUBMITTED', 'UNDER_REVIEW'],
  progress: ['INVESTIGATION_IN_PROGRESS'],
  resolved: ['RESOLVED', 'CLOSED'],
};

function getStatusCount(complaints, statuses) {
  return complaints.filter((item) =>
    statuses.includes(String(item.status || '').toUpperCase())
  ).length;
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CitizenDashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const results = await Promise.allSettled([
        apiClient.get('/citizen/complaints.php'),
        apiClient.get('/citizen/notifications.php'),
      ]);

      if (results[0].status === 'fulfilled') {
        setComplaints(results[0].value.data?.data || []);
      } else {
        throw results[0].reason;
      }

      if (results[1].status === 'fulfilled') {
        setNotifications(Array.isArray(results[1].value.data?.data?.notifications) ? results[1].value.data.data.notifications : []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to load dashboard information.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const pending = getStatusCount(complaints, STATUSES.pending);
  const inProgress = getStatusCount(complaints, STATUSES.progress);
  const resolved = getStatusCount(complaints, STATUSES.resolved);

  const unreadCount = notifications.filter(
    (item) =>
      item.is_read === false ||
      item.is_read === 0 ||
      item.is_read === '0'
  ).length;

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.incident_date || 0) -
        new Date(a.created_at || a.incident_date || 0)
    )
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Complaints',
      value: complaints.length,
      icon: FileText,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Search,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-700',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Citizen Dashboard"
        description="Monitor your complaints, track updates and stay informed."
      />

      <section className="rounded-xl bg-navy-900 p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-300">Welcome back,</p>
            <h2 className="mt-1 text-2xl font-bold">
              {user?.full_name || 'Citizen'}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Your complaints and their latest progress are available here.
            </p>
          </div>

          <Link
            to="/citizen/complaints"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Submit Complaint
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">
          Complaint Overview
        </h2>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-800 hover:underline disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-navy-900">
                    {loading ? '—' : stat.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">
              Recent Complaints
            </h2>

            <Link
              to="/citizen/complaints"
              className="text-sm font-medium text-navy-800 hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="py-6 text-sm text-slate-500">
              Loading complaints...
            </p>
          ) : recentComplaints.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No complaints submitted yet.
              </p>
              <Link
                to="/citizen/complaints"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline"
              >
                Submit your first complaint <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-navy-900">
                      {complaint.subject}
                    </p>
                    <Badge>{complaint.status || 'Unknown'}</Badge>
                  </div>

                  <p className="text-xs text-slate-500">
                    Ref: {complaint.complaint_ref || '—'} ·{' '}
                    {formatDate(complaint.created_at || complaint.incident_date)}
                  </p>

                  <p className="text-xs text-slate-500">
                    Category: {complaint.category_name || '—'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">
              Notifications
            </h2>
            <Bell className="h-5 w-5 text-slate-500" />
          </div>

          <div className="mb-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Unread notifications</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">
              {loading ? '—' : unreadCount}
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              No notifications available.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="border-b border-slate-100 pb-3 last:border-0"
                >
                  <p className="text-sm font-medium text-navy-900">
                    {notification.title || 'Notification'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message || notification.body || 'You have a new update.'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

