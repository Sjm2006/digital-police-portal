import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  X,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  FileText,
  Send,
} from 'lucide-react';

import apiClient from '../../services/apiClient';

const STATUS_OPTIONS = [
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  {
    value: 'INVESTIGATION_IN_PROGRESS',
    label: 'Investigation in Progress',
  },
  { value: 'RESOLVED', label: 'Resolved' },
];

const STATUS_LABELS = {
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  UNDER_REVIEW: 'Under Review',
  INVESTIGATION_IN_PROGRESS: 'Investigation in Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

const getPayload = (response) => response.data?.data ?? response.data;

const getStatusStyle = (status) => {
  switch (status) {
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'INVESTIGATION_IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 ring-blue-200';
    case 'UNDER_REVIEW':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    case 'CLOSED':
      return 'bg-slate-100 text-slate-600 ring-slate-200';
    default:
      return 'bg-purple-50 text-purple-700 ring-purple-200';
  }
};

const formatDate = (date) => {
  if (!date) return 'Not available';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString();
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${getStatusStyle(
        status
      )}`}
    >
      {STATUS_LABELS[status] || status?.replaceAll('_', ' ')}
    </span>
  );
}

export default function OfficerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedStatus, setSelectedStatus] = useState('');
  const [remark, setRemark] = useState('');

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch complaints assigned to the logged-in officer.
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.get('/officer/complaints.php');
      const payload = getPayload(response);

      setComplaints(
        Array.isArray(payload?.complaints)
          ? payload.complaints
          : Array.isArray(payload)
          ? payload
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load assigned complaints.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Fetch complete complaint details.
  const openComplaint = async (complaintId) => {
    try {
      setDetailsLoading(true);
      setError('');
      setSuccess('');

      const response = await apiClient.get('/officer/complaints.php', {
        params: { id: complaintId },
      });

      const payload = getPayload(response);
      const complaint = payload?.complaint ?? payload;

      setSelectedComplaint(complaint);

      setSelectedStatus(
        STATUS_OPTIONS.some((option) => option.value === complaint.status)
          ? complaint.status
          : ''
      );

      setRemark('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load complaint details.'
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update complaint status.
  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (!selectedComplaint || !selectedStatus) {
      setError('Please select a complaint status.');
      return;
    }

    if (remark.trim().length < 3) {
      setError('Please enter a remark of at least 3 characters.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await apiClient.patch('/officer/complaints.php', {
        complaint_id: selectedComplaint.id,
        status: selectedStatus,
        remark: remark.trim(),
      });

      setSuccess('Complaint status updated successfully.');

      await fetchComplaints();

      // Refresh the selected complaint details.
      const response = await apiClient.get('/officer/complaints.php', {
        params: { id: selectedComplaint.id },
      });

      const payload = getPayload(response);
      const updatedComplaint = payload?.complaint ?? payload;

      setSelectedComplaint(updatedComplaint);
      setSelectedStatus(
        STATUS_OPTIONS.some((option) => option.value === updatedComplaint.status)
          ? updatedComplaint.status
          : ''
      );
      setRemark('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to update complaint status.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Search and filter complaints.
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.complaint_ref?.toLowerCase().includes(searchText) ||
        complaint.subject?.toLowerCase().includes(searchText) ||
        complaint.citizen_name?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'ALL' || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const canUpdate =
    selectedComplaint &&
    !['RESOLVED', 'CLOSED', 'REJECTED'].includes(selectedComplaint.status);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Assigned Complaints
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review, investigate and update your assigned complaints.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ClipboardList size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Assigned
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {complaints.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Active Complaints
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {
                  complaints.filter((item) =>
                    [
                      'SUBMITTED',
                      'ASSIGNED',
                      'UNDER_REVIEW',
                      'INVESTIGATION_IN_PROGRESS',
                    ].includes(item.status)
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Resolved Complaints
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {
                  complaints.filter((item) => item.status === 'RESOLVED')
                    .length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by reference, subject or citizen..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Complaint Records
          </h2>
          <span className="text-xs text-slate-500">
            {filteredComplaints.length} result(s)
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading assigned complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList size={28} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              No complaints found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Assigned complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Reference</th>
                  <th className="px-4 py-2.5 font-semibold">Subject</th>
                  <th className="px-4 py-2.5 font-semibold">Citizen</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Submitted</th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {complaint.complaint_ref}
                    </td>

                    <td className="max-w-xs px-4 py-3 text-slate-800">
                      {complaint.subject}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {complaint.citizen_name || 'Not available'}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(complaint.submitted_at)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openComplaint(complaint.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Details Panel */}
      {selectedComplaint && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-start justify-between border-b border-slate-100 p-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Complaint Details
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {selectedComplaint.complaint_ref}
              </p>
            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close complaint details"
            >
              <X size={18} />
            </button>
          </div>

          {detailsLoading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading complaint details...
            </div>
          ) : (
            <div className="space-y-5 p-4">
              {/* Complaint Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Subject
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {selectedComplaint.subject}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Category
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selectedComplaint.category_name || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Current Status
                  </p>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Incident Date
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                    <Calendar size={14} className="text-slate-400" />
                    {formatDate(selectedComplaint.incident_date)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Incident Location
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                    <MapPin size={14} className="text-slate-400" />
                    {selectedComplaint.incident_location || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Police Station
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selectedComplaint.police_station_name || 'Not available'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText size={16} className="text-slate-500" />
                  Complaint Description
                </h3>
                <p className="whitespace-pre-wrap rounded-lg bg-slate-50/60 p-3 text-sm leading-6 text-slate-700">
                  {selectedComplaint.description || 'No description provided.'}
                </p>
              </div>

              {/* Citizen Information */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <User size={16} className="text-slate-500" />
                  Citizen Information
                </h3>

                <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50/60 p-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Name
                    </p>
                    <p className="mt-0.5 text-slate-800">
                      {selectedComplaint.citizen_name || 'Not available'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Email
                    </p>
                    <p className="mt-0.5 break-all text-slate-800">
                      {selectedComplaint.citizen_email || 'Not available'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Phone
                    </p>
                    <p className="mt-0.5 text-slate-800">
                      {selectedComplaint.citizen_phone || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Complaint History */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Complaint History
                </h3>

                {!selectedComplaint.history?.length ? (
                  <p className="rounded-lg bg-slate-50/60 p-3 text-sm text-slate-500">
                    No history available.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedComplaint.history.map((item, index) => (
                      <div
                        key={`${item.created_at}-${index}`}
                        className="rounded-lg border border-slate-200 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-800">
                            {STATUS_LABELS[item.new_status] ||
                              item.new_status}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Updated by: {item.updated_by_name || 'System'}
                        </p>

                        {item.remark && (
                          <p className="mt-1.5 text-sm text-slate-600">
                            {item.remark}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              {canUpdate && (
                <form
                  onSubmit={handleStatusUpdate}
                  className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Update Complaint Status
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Select the new status and provide an investigation remark.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="complaint-status"
                      className="mb-1 block text-xs font-medium text-slate-600"
                    >
                      New Status
                    </label>

                    <select
                      id="complaint-status"
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select status</option>

                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="complaint-remark"
                      className="mb-1 block text-xs font-medium text-slate-600"
                    >
                      Investigation Remark
                    </label>

                    <textarea
                      id="complaint-remark"
                      rows={4}
                      minLength={3}
                      maxLength={1000}
                      required
                      value={remark}
                      onChange={(event) => setRemark(event.target.value)}
                      placeholder="Enter investigation remarks..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !selectedStatus}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={15} />
                    {saving ? 'Updating...' : 'Update Status'}
                  </button>
                </form>
              )}

              {!canUpdate && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  This complaint is no longer available for status updates.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}