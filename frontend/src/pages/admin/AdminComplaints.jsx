import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  UserCheck,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';

import apiClient from '../../services/apiClient';

const STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'INVESTIGATION_IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
];

const UPDATE_STATUSES = [
  'UNDER_REVIEW',
  'INVESTIGATION_IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
];

const statusStyle = (status) => {
  const styles = {
    SUBMITTED: 'bg-blue-50 text-blue-700 ring-blue-200',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 ring-amber-200',
    ASSIGNED: 'bg-purple-50 text-purple-700 ring-purple-200',
    INVESTIGATION_IN_PROGRESS: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-600 ring-slate-200',
    REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  };

  return styles[status] || 'bg-slate-100 text-slate-600 ring-slate-200';
};

const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsed = new Date(date.replace(' ', 'T'));

  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError('');

      const params = statusFilter ? { status: statusFilter } : {};

      const response = await apiClient.get('/admin/complaints.php', { params });
      const data = response.data?.data;

      setComplaints(data?.complaints || []);
      setOfficers(data?.officers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load complaints. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  const filteredComplaints = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return complaints;

    return complaints.filter((complaint) =>
      [
        complaint.complaint_ref,
        complaint.subject,
        complaint.citizen_name,
        complaint.citizen_user_id,
        complaint.category_name,
        complaint.officer_name,
        complaint.police_station,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [complaints, search]);

  const counts = useMemo(
    () => ({
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === 'SUBMITTED').length,
      assigned: complaints.filter((c) => c.status === 'ASSIGNED').length,
      investigation: complaints.filter(
        (c) => c.status === 'INVESTIGATION_IN_PROGRESS'
      ).length,
      resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
    }),
    [complaints]
  );

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedOfficer('');
    setNewStatus('');
    setRemark('');
    setRejectionReason('');
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    if (processing) return;

    setSelectedComplaint(null);
    setSelectedOfficer('');
    setNewStatus('');
    setRemark('');
    setRejectionReason('');
  };

  const assignOfficer = async () => {
    if (!selectedComplaint) return;

    if (!selectedOfficer) {
      setError('Please select an officer.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setMessage('');

      await apiClient.post('/admin/complaints.php', {
        action: 'assign',
        complaint_id: selectedComplaint.id,
        officer_id: Number(selectedOfficer),
      });

      setMessage('Complaint assigned successfully.');
      await loadComplaints();
      setSelectedComplaint(null);
      setSelectedOfficer('');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to assign complaint.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const updateStatus = async () => {
    if (!selectedComplaint) return;

    if (!newStatus) {
      setError('Please select a status.');
      return;
    }

    if (remark.trim().length < 3) {
      setError('Please enter a remark of at least 3 characters.');
      return;
    }

    if (newStatus === 'REJECTED' && !rejectionReason.trim()) {
      setError('Please enter a rejection reason.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setMessage('');

      await apiClient.patch('/admin/complaints.php', {
        complaint_id: selectedComplaint.id,
        status: newStatus,
        remark: remark.trim(),
        rejection_reason: rejectionReason.trim(),
      });

      setMessage('Complaint status updated successfully.');
      await loadComplaints();
      setSelectedComplaint(null);
      setNewStatus('');
      setRemark('');
      setRejectionReason('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update complaint status.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const isFinalComplaint =
    selectedComplaint &&
    ['RESOLVED', 'CLOSED', 'REJECTED'].includes(selectedComplaint.status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Manage Complaints
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review complaints, assign police officers and manage progress.
            </p>
          </div>

          <button
            onClick={loadComplaints}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
            <CheckCircle size={16} />
            {message}
            <button onClick={() => setMessage('')} className="ml-auto">
              <X size={15} />
            </button>
          </div>
        )}

        {error && !selectedComplaint && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            title="Total"
            value={counts.total}
            icon={FileText}
            tone="text-slate-600 bg-slate-100"
          />
          <StatCard
            title="Submitted"
            value={counts.submitted}
            icon={Clock}
            tone="text-amber-600 bg-amber-50"
          />
          <StatCard
            title="Assigned"
            value={counts.assigned}
            icon={UserCheck}
            tone="text-purple-600 bg-purple-50"
          />
          <StatCard
            title="Investigating"
            value={counts.investigation}
            icon={AlertCircle}
            tone="text-indigo-600 bg-indigo-50"
          />
          <StatCard
            title="Resolved"
            value={counts.resolved}
            icon={CheckCircle}
            tone="text-emerald-600 bg-emerald-50"
          />
        </div>

        {/* Search and Filter */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaint ID, citizen, subject or officer..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative md:w-60">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
              <RefreshCw className="animate-spin" size={16} />
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No complaints found"
              description="Try changing your search or status filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Complaint</th>
                    <th className="px-4 py-2.5 font-semibold">Citizen</th>
                    <th className="px-4 py-2.5 font-semibold">Category</th>
                    <th className="px-4 py-2.5 font-semibold">Officer</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 font-semibold">Date</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {complaint.complaint_ref}
                        </p>
                        <p className="mt-0.5 max-w-48 truncate text-xs text-slate-500">
                          {complaint.subject}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-slate-800">
                          {complaint.citizen_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {complaint.citizen_user_id}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {complaint.category_name || 'N/A'}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-slate-700">
                          {complaint.officer_name || 'Not assigned'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {complaint.police_station || ''}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusStyle(complaint.status)}`}
                        >
                          {complaint.status?.replaceAll('_', ' ')}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {formatDate(complaint.submitted_at)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openComplaint(complaint)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Eye size={14} />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Management Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-slate-100 p-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Manage Complaint
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedComplaint.complaint_ref}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={processing}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-4">
              {/* Complaint Details */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaint Details
                </h3>

                <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50/60 p-3 sm:grid-cols-2">
                  <Detail label="Subject" value={selectedComplaint.subject} />
                  <Detail label="Category" value={selectedComplaint.category_name} />
                  <Detail label="Citizen" value={selectedComplaint.citizen_name} />
                  <Detail label="Phone" value={selectedComplaint.citizen_phone} />
                  <Detail
                    label="Incident Date"
                    value={formatDate(selectedComplaint.incident_date)}
                  />
                  <Detail
                    label="Incident Location"
                    value={selectedComplaint.incident_location}
                  />
                  <Detail
                    label="Current Status"
                    value={selectedComplaint.status?.replaceAll('_', ' ')}
                  />
                  <Detail
                    label="Police Station"
                    value={selectedComplaint.police_station || 'Not assigned'}
                  />
                </div>

                <div className="mt-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </p>
                  <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
                    {selectedComplaint.description || 'No description provided.'}
                  </p>
                </div>
              </section>

              {/* Assign Officer */}
              {!isFinalComplaint && (
                <section className="border-t border-slate-100 pt-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <UserCheck size={16} className="text-slate-500" />
                    Assign Police Officer
                  </h3>

                  <p className="mb-2 text-xs text-slate-500">
                    Current officer:{' '}
                    <span className="font-medium text-slate-700">
                      {selectedComplaint.officer_name || 'Not assigned'}
                    </span>
                  </p>

                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select an active officer</option>
                    {officers.map((officer) => (
                      <option
                        key={officer.id}
                        value={officer.id}
                        disabled={!officer.police_station}
                      >
                        {officer.full_name}
                        {' — '}
                        {officer.designation || 'Officer'}
                        {' — '}
                        {officer.police_station || 'No station assigned'}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={assignOfficer}
                    disabled={processing || !selectedOfficer}
                    className="mt-2.5 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UserCheck size={15} />
                    {processing ? 'Processing...' : 'Assign Officer'}
                  </button>

                  {officers.length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      No active officers with profiles are available.
                    </p>
                  )}
                </section>
              )}

              {/* Update Status */}
              {!isFinalComplaint && (
                <section className="border-t border-slate-100 pt-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">
                    Update Complaint Status
                  </h3>

                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select new status</option>
                    {UPDATE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>

                  <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">
                    Remark
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Enter the reason or progress update..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                  {newStatus === 'REJECTED' && (
                    <>
                      <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="Enter the rejection reason..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </>
                  )}

                  <button
                    onClick={updateStatus}
                    disabled={processing || !newStatus}
                    className="mt-3 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Update Status'}
                  </button>
                </section>
              )}

              {isFinalComplaint && (
                <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  This complaint has a final status and cannot be assigned or
                  updated.
                </p>
              )}

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 p-3">
              <button
                onClick={closeModal}
                disabled={processing}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <span className={`rounded-lg p-1.5 ${tone}`}>
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 break-words text-sm text-slate-800">
        {value || 'N/A'}
      </p>
    </div>
  );
}

// + ADDED — shared lightweight empty state
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="p-10 text-center">
      <Icon size={28} className="mx-auto mb-2 text-slate-300" />
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}