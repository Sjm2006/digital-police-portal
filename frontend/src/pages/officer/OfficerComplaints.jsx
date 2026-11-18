
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

const getPayload = (response) =>
  response.data?.data ?? response.data;

const getStatusStyle = (status) => {
  switch (status) {
    case 'RESOLVED':
      return 'bg-green-100 text-green-700';

    case 'INVESTIGATION_IN_PROGRESS':
      return 'bg-blue-100 text-blue-700';

    case 'UNDER_REVIEW':
      return 'bg-yellow-100 text-yellow-700';

    case 'REJECTED':
      return 'bg-red-100 text-red-700';

    case 'CLOSED':
      return 'bg-gray-200 text-gray-700';

    default:
      return 'bg-purple-100 text-purple-700';
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
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

      const response = await apiClient.get(
        '/officer/complaints.php',
        { params: { id: complaintId } }
      );

      const payload = getPayload(response);
      const complaint = payload?.complaint ?? payload;

      setSelectedComplaint(complaint);

      setSelectedStatus(
        STATUS_OPTIONS.some(
          (option) => option.value === complaint.status
        )
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
      const response = await apiClient.get(
        '/officer/complaints.php',
        { params: { id: selectedComplaint.id } }
      );

      const payload = getPayload(response);
      const updatedComplaint = payload?.complaint ?? payload;

      setSelectedComplaint(updatedComplaint);
      setSelectedStatus(
        STATUS_OPTIONS.some(
          (option) => option.value === updatedComplaint.status
        )
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
        statusFilter === 'ALL' ||
        complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const canUpdate =
    selectedComplaint &&
    !['RESOLVED', 'CLOSED', 'REJECTED'].includes(
      selectedComplaint.status
    );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assigned Complaints
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, investigate and update your assigned complaints.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Total Assigned
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {complaints.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Active Complaints
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
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

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Resolved Complaints
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {
                  complaints.filter(
                    (item) => item.status === 'RESOLVED'
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by reference, subject or citizen..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Complaint Records
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {filteredComplaints.length} complaint(s) found
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading assigned complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList
              size={36}
              className="mx-auto mb-3 text-gray-300"
            />
            <p className="font-medium text-gray-700">
              No complaints found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Assigned complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Citizen</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-blue-700">
                      {complaint.complaint_ref}
                    </td>

                    <td className="max-w-xs px-5 py-4 font-medium text-gray-800">
                      {complaint.subject}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {complaint.citizen_name || 'Not available'}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(complaint.submitted_at)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openComplaint(complaint.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        <Eye size={15} />
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
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <div>
              <h2 className="font-bold text-gray-900">
                Complaint Details
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {selectedComplaint.complaint_ref}
              </p>
            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close complaint details"
            >
              <X size={20} />
            </button>
          </div>

          {detailsLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading complaint details...
            </div>
          ) : (
            <div className="space-y-6 p-5">
              {/* Complaint Information */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Subject
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedComplaint.subject}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Category
                  </p>
                  <p className="mt-1 text-gray-800">
                    {selectedComplaint.category_name || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Current Status
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Incident Date
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-gray-800">
                    <Calendar size={15} />
                    {formatDate(selectedComplaint.incident_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Incident Location
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-gray-800">
                    <MapPin size={15} />
                    {selectedComplaint.incident_location || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Police Station
                  </p>
                  <p className="mt-1 text-gray-800">
                    {selectedComplaint.police_station_name || 'Not available'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                  <FileText size={17} />
                  Complaint Description
                </h3>
                <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedComplaint.description || 'No description provided.'}
                </p>
              </div>

              {/* Citizen Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                  <User size={17} />
                  Citizen Information
                </h3>

                <div className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {selectedComplaint.citizen_name || 'Not available'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="mt-1 break-all text-gray-800">
                      {selectedComplaint.citizen_email || 'Not available'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="mt-1 text-gray-800">
                      {selectedComplaint.citizen_phone || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Complaint History */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Complaint History
                </h3>

                {!selectedComplaint.history?.length ? (
                  <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No history available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedComplaint.history.map((item, index) => (
                      <div
                        key={`${item.created_at}-${index}`}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {STATUS_LABELS[item.new_status] ||
                              item.new_status}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          Updated by: {item.updated_by_name || 'System'}
                        </p>

                        {item.remark && (
                          <p className="mt-2 text-sm text-gray-600">
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
                  className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Update Complaint Status
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Select the new status and provide an investigation remark.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="complaint-status"
                      className="mb-2 block text-sm font-medium text-gray-700"
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
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Select status</option>

                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="complaint-remark"
                      className="mb-2 block text-sm font-medium text-gray-700"
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
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !selectedStatus}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={16} />
                    {saving ? 'Updating...' : 'Update Status'}
                  </button>
                </form>
              )}

              {!canUpdate && (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
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
