
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
    SUBMITTED: 'bg-blue-100 text-blue-700',
    UNDER_REVIEW: 'bg-amber-100 text-amber-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    INVESTIGATION_IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-slate-200 text-slate-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return styles[status] || 'bg-slate-100 text-slate-700';
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

      const params = statusFilter
        ? { status: statusFilter }
        : {};

      const response = await apiClient.get(
        '/admin/complaints.php',
        { params }
      );

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
        .some((value) =>
          String(value).toLowerCase().includes(term)
        )
    );
  }, [complaints, search]);

  const counts = useMemo(() => ({
    total: complaints.length,
    submitted: complaints.filter(
      (c) => c.status === 'SUBMITTED'
    ).length,
    assigned: complaints.filter(
      (c) => c.status === 'ASSIGNED'
    ).length,
    investigation: complaints.filter(
      (c) => c.status === 'INVESTIGATION_IN_PROGRESS'
    ).length,
    resolved: complaints.filter(
      (c) => c.status === 'RESOLVED'
    ).length,
  }), [complaints]);

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
        err.response?.data?.message ||
        'Failed to assign complaint.'
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

  const isFinalComplaint = selectedComplaint &&
    ['RESOLVED', 'CLOSED', 'REJECTED'].includes(
      selectedComplaint.status
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Complaints
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review complaints, assign police officers and manage progress.
            </p>
          </div>

          <button
            onClick={loadComplaints}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle size={18} />
            {message}
            <button
              onClick={() => setMessage('')}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && !selectedComplaint && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            title="Total Complaints"
            value={counts.total}
            icon={FileText}
            color="text-blue-600"
          />
          <StatCard
            title="Submitted"
            value={counts.submitted}
            icon={Clock}
            color="text-amber-600"
          />
          <StatCard
            title="Assigned"
            value={counts.assigned}
            icon={UserCheck}
            color="text-purple-600"
          />
          <StatCard
            title="Under Investigation"
            value={counts.investigation}
            icon={AlertCircle}
            color="text-indigo-600"
          />
          <StatCard
            title="Resolved"
            value={counts.resolved}
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        {/* Search and Filter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaint ID, citizen, subject or officer..."
                className="form-input w-full pl-10"
              />
            </div>

            <div className="relative md:w-64">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input w-full pl-10"
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
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Complaint Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredComplaints.length} complaint(s)
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-slate-500">
              <RefreshCw className="animate-spin" size={20} />
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText
                size={36}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="font-medium text-slate-700">
                No complaints found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Complaint</th>
                    <th className="px-5 py-3">Citizen</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Assigned Officer</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {complaint.complaint_ref}
                        </p>
                        <p className="mt-1 max-w-48 truncate text-xs text-slate-500">
                          {complaint.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {complaint.citizen_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {complaint.citizen_user_id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {complaint.category_name || 'N/A'}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-slate-700">
                          {complaint.officer_name || 'Not assigned'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {complaint.police_station || ''}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(complaint.status)}`}>
                          {complaint.status?.replaceAll('_', ' ')}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(complaint.submitted_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openComplaint(complaint)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Eye size={15} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Complaint
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedComplaint.complaint_ref}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={processing}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5">

              {/* Complaint Details */}
              <section>
                <h3 className="mb-3 font-semibold text-slate-900">
                  Complaint Details
                </h3>

                <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                  <Detail
                    label="Subject"
                    value={selectedComplaint.subject}
                  />
                  <Detail
                    label="Category"
                    value={selectedComplaint.category_name}
                  />
                  <Detail
                    label="Citizen"
                    value={selectedComplaint.citizen_name}
                  />
                  <Detail
                    label="Phone"
                    value={selectedComplaint.citizen_phone}
                  />
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

                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                    Description
                  </p>
                  <p className="whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                    {selectedComplaint.description || 'No description provided.'}
                  </p>
                </div>
              </section>

              {/* Assign Officer */}
              {!isFinalComplaint && (
                <section className="border-t border-slate-200 pt-5">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                    <UserCheck size={18} />
                    Assign Police Officer
                  </h3>

                  <p className="mb-3 text-sm text-slate-500">
                    Current officer: {selectedComplaint.officer_name || 'Not assigned'}
                  </p>

                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="form-input w-full"
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
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UserCheck size={16} />
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
                <section className="border-t border-slate-200 pt-5">
                  <h3 className="mb-3 font-semibold text-slate-900">
                    Update Complaint Status
                  </h3>

                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    New Status
                  </label>

                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Select new status</option>
                    {UPDATE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>

                  <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
                    Remark
                  </label>

                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Enter the reason or progress update..."
                    className="form-input w-full"
                  />

                  {newStatus === 'REJECTED' && (
                    <>
                      <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
                        Rejection Reason
                      </label>

                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="Enter the rejection reason..."
                        className="form-input w-full"
                      />
                    </>
                  )}

                  <button
                    onClick={updateStatus}
                    disabled={processing || !newStatus}
                    className="mt-3 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Update Status'}
                  </button>
                </section>
              )}

              {isFinalComplaint && (
                <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                  This complaint has a final status and cannot be assigned or updated.
                </p>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 p-4">
              <button
                onClick={closeModal}
                disabled={processing}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          {title}
        </p>
        <Icon size={19} className={color} />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || 'N/A'}
      </p>
    </div>
  );
}
