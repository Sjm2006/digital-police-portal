
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
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-red-100 text-red-700',
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'
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

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const response = await apiClient.get('/admin/users.php', {
        params,
      });

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

      setSuccess(
        `${user.full_name}'s account status changed to ${newStatus}.`
      );

      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to update account status.'
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
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Active Accounts',
      value: stats.active_users,
      icon: UserCheck,
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Inactive Accounts',
      value: stats.inactive_users,
      icon: UserX,
      color: 'bg-gray-100 text-gray-700',
    },
    {
      title: 'Suspended Accounts',
      value: stats.suspended_users,
      icon: ShieldAlert,
      color: 'bg-red-100 text-red-700',
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Citizen Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage registered citizen accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
          <button
            type="button"
            onClick={() => setError('')}
            className="ml-auto"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
          <button type="button" onClick={() => setSuccess('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or citizen ID..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'All Statuses' : status}
            </option>
          ))}
        </select>
      </div>

      {/* Citizen Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Registered Citizens
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredUsers.length} records found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 size={22} className="animate-spin" />
            Loading citizen records...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-medium text-gray-700">
              No citizens found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Citizen</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Complaints</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Registered</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {user.full_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {user.user_id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-gray-700">{user.email}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">
                        {user.complaints_count ?? 0}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View details"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </button>

                        {user.status !== 'ACTIVE' ? (
                          <button
                            type="button"
                            title="Activate account"
                            disabled={processingId === user.id}
                            onClick={() => updateStatus(user, 'ACTIVE')}
                            className="rounded-lg border border-green-200 p-2 text-green-700 hover:bg-green-50 disabled:opacity-50"
                          >
                            <UserCheck size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Deactivate account"
                            disabled={processingId === user.id}
                            onClick={() => updateStatus(user, 'INACTIVE')}
                            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <UserX size={16} />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Citizen Details
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Account information and activity
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {selectedUser.full_name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedUser.user_id}
                </p>
                <div className="mt-3">
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Total Complaints</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedUser.complaints_count ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Registered On</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(selectedUser.last_login_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Account Actions
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedUser.status !== 'ACTIVE' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'ACTIVE')}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}

                  {selectedUser.status !== 'INACTIVE' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'INACTIVE')}
                      className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  )}

                  {selectedUser.status !== 'SUSPENDED' && (
                    <button
                      type="button"
                      disabled={processingId === selectedUser.id}
                      onClick={() => updateStatus(selectedUser, 'SUSPENDED')}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
