import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  ShieldAlert,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import apiClient from '../../services/apiClient';

const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'];

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  INACTIVE: 'bg-slate-100 text-slate-600 ring-slate-200',
  SUSPENDED: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const formatDate = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    suspended_users: 0,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const response = await apiClient.get('/admin/users.php', { params });
      const data = response?.data?.data;

      setUsers(data?.users || []);
      setStats({
        total_users: Number(data?.stats?.total_users || 0),
        active_users: Number(data?.stats?.active_users || 0),
        inactive_users: Number(data?.stats?.inactive_users || 0),
        suspended_users: Number(data?.stats?.suspended_users || 0),
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Unable to load citizen records. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => users, [users]);

  const updateStatus = async (user, newStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to change ${user.full_name}'s account status to ${newStatus}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(user.id);
      setError('');
      setSuccess('');

      await apiClient.patch('/admin/users.php', {
        user_id: user.id,
        status: newStatus,
      });

      setSuccess(`${user.full_name}'s account status changed to ${newStatus}.`);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Unable to update account status.'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const statCards = [
    {
      title: 'Total Citizens',
      value: stats.total_users,
      icon: Users,
      tone: 'text-slate-600 bg-slate-100',
    },
    {
      title: 'Active Accounts',
      value: stats.active_users,
      icon: UserCheck,
      tone: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Inactive Accounts',
      value: stats.inactive_users,
      icon: UserX,
      tone: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Suspended Accounts',
      value: stats.suspended_users,
      icon: ShieldAlert,
      tone: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Citizen Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage registered citizen accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
          <button
            type="button"
            onClick={() => setError('')}
            className="ml-auto"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
          {success}
          <button type="button" onClick={() => setSuccess('')}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
                <span className={`rounded-lg p-2 ${item.tone}`}>
                  <Icon size={16} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs md:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or citizen ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'All Statuses' : status}
            </option>
          ))}
        </select>
      </div>

      {/* Citizen Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Registered Citizens
          </h2>
          <span className="text-xs text-slate-500">
            {filteredUsers.length} records
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Loading citizen records...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-14 text-center">
            <Users size={28} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-700">
              No citizens found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Citizen</th>
                  <th className="px-4 py-2.5 font-semibold">Contact</th>
                  <th className="px-4 py-2.5 font-semibold">Complaints</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Registered</th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {user.full_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {user.user_id}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-slate-700">{user.email}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {user.complaints_count ?? 0}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          title="View details"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          <Eye size={14} />
                        </button>

                        {user.status !== 'ACTIVE' ? (
                          <button
                            type="button"
                            title="Activate account"
                            disabled={processingId === user.id}
                            onClick={() => updateStatus(user, 'ACTIVE')}
                            className="rounded-lg border border-emerald-200 p-1.5 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                          >
                            <UserCheck size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Deactivate account"
                            disabled={processingId === user.id}
                            onClick={() => updateStatus(user, 'INACTIVE')}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          >
                            <UserX size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Citizen Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Citizen Details
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Account information and activity
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedUser.full_name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedUser.user_id}
                </p>
                <div className="mt-2">
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Email
                    </p>
                    <p className="text-sm text-slate-800">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Phone
                    </p>
                    <p className="text-sm text-slate-800">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Total Complaints
                    </p>
                    <p className="text-sm text-slate-800">
                      {selectedUser.complaints_count ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Registered On
                    </p>
                    <p className="text-sm text-slate-800">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Last Login
                    </p>
                    <p className="text-sm text-slate-800">
                      {formatDate(selectedUser.last_login_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-sm font-medium text-slate-800">
                  Account Actions
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedUser.status !== 'ACTIVE' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'ACTIVE')}
                      className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}

                  {selectedUser.status !== 'INACTIVE' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'INACTIVE')}
                      className="rounded-lg bg-slate-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  )}

                  {selectedUser.status !== 'SUSPENDED' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'SUSPENDED')}
                      className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}