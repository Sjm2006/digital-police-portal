﻿import { useEffect, useState } from 'react';
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
        setNotifications(
          Array.isArray(results[1].value.data?.data?.notifications)
            ? results[1].value.data.data.notifications
            : []
        );
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
      item.is_read === false || item.is_read === 0 || item.is_read === '0'
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
      tone: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Search,
      tone: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      tone: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Citizen Dashboard"
        description="Monitor your complaints, track updates and stay informed."
      />

      {/* Welcome banner — lighter gradient + border instead of solid navy */}
      <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xs sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Welcome back
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {user?.full_name || 'Citizen'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-300">
              Your complaints and their latest progress are available here.
            </p>
          </div>

          <Link
            to="/citizen/complaints"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-xs transition hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Submit Complaint
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Complaint Overview
        </h2>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {loading ? '—' : stat.value}
                  </p>
                </div>

                <span className={`rounded-lg p-2 ${stat.tone}`}>
                  <Icon size={16} />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Recent complaints */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Complaints
            </h2>

            <Link
              to="/citizen/complaints"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
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
              <FileText
                size={28}
                className="mx-auto text-slate-300"
              />
              <p className="mt-2 text-sm text-slate-500">
                No complaints submitted yet.
              </p>
              <Link
                to="/citizen/complaints"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Submit your first complaint <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex flex-col gap-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">
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

        {/* Notifications */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Notifications
            </h2>
            <Bell size={16} className="text-slate-400" />
          </div>

          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Unread notifications
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
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
            <div className="space-y-2.5">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {notification.title || 'Notification'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {notification.message ||
                      notification.body ||
                      'You have a new update.'}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
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