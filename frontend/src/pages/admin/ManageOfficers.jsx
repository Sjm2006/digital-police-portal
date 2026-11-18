
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UserPlus, Search, RefreshCw, Pencil, X, Users,
  UserCheck, UserX, ShieldCheck, MapPin, Loader2
} from 'lucide-react';
import apiClient from '../../services/apiClient';

const EMPTY_FORM = {
  full_name: '',
  email: '',
  phone: '',
  password: '',
  designation: '',
  department: '',
  police_station_id: '',
  status: 'ACTIVE',
};

const STATUS_STYLES = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-slate-100 text-slate-600',
  SUSPENDED: 'bg-red-100 text-red-700',
};

export default function ManageOfficers() {
  const [officers, setOfficers] = useState([]);
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadOfficers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/admin/officers.php');
      const data = response.data?.data;

      setOfficers(data?.officers ?? []);
      setStations(data?.stations ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load officers. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfficers();
  }, [loadOfficers]);

  const filteredOfficers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return officers.filter((officer) => {
      const matchesSearch = !term || [
        officer.full_name,
        officer.user_id,
        officer.email,
        officer.phone,
        officer.police_station_name,
        officer.designation,
      ].some((value) => String(value ?? '').toLowerCase().includes(term));

      const matchesStatus =
        !statusFilter || officer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [officers, search, statusFilter]);

  const stats = useMemo(() => ({
    total: officers.length,
    active: officers.filter((o) => o.status === 'ACTIVE').length,
    inactive: officers.filter((o) => o.status === 'INACTIVE').length,
    suspended: officers.filter((o) => o.status === 'SUSPENDED').length,
  }), [officers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setMessage('');
    setFormOpen(true);
  };

  const openEdit = (officer) => {
    setEditingId(officer.id);
    setForm({
      full_name: officer.full_name ?? '',
      email: officer.email ?? '',
      phone: officer.phone ?? '',
      password: '',
      designation: officer.designation ?? '',
      department: officer.department ?? '',
      police_station_id: String(officer.police_station_id ?? ''),
      status: officer.status ?? 'ACTIVE',
    });
    setError('');
    setMessage('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      police_station_id: Number(form.police_station_id),
    };

    if (editingId) {
      payload.officer_id = editingId;
      if (!payload.password) delete payload.password;
    }

    try {
      if (editingId) {
        await apiClient.patch('/admin/officers.php', payload);
        setMessage('Officer details updated successfully.');
      } else {
        await apiClient.post('/admin/officers.php', payload);
        setMessage('Officer account created successfully.');
      }

      setFormOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadOfficers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save officer details.'
      );
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (officer) => {
    const nextStatus =
      officer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus === 'ACTIVE' ? 'activate' : 'deactivate'} ${officer.full_name}?`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await apiClient.patch('/admin/officers.php', {
        officer_id: officer.id,
        full_name: officer.full_name,
        email: officer.email,
        phone: officer.phone,
        designation: officer.designation,
        department: officer.department,
        police_station_id: officer.police_station_id,
        status: nextStatus,
      });

      setMessage(`Officer ${nextStatus.toLowerCase()} successfully.`);
      await loadOfficers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update officer status.'
      );
    }
  };

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manage Officers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, manage and monitor police officer accounts.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <UserPlus size={18} />
          Add Officer
        </button>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
          <button onClick={clearMessages} aria-label="Dismiss message">
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button onClick={clearMessages} aria-label="Dismiss error">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Officers', value: stats.total, icon: Users },
          { label: 'Active Officers', value: stats.active, icon: UserCheck },
          { label: 'Inactive Officers', value: stats.inactive, icon: UserX },
          { label: 'Suspended Officers', value: stats.suspended, icon: ShieldCheck },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <item.icon size={21} className="text-slate-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email, phone or station..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button
            onClick={loadOfficers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Officer</th>
                <th className="px-5 py-4">Officer ID</th>
                <th className="px-5 py-4">Designation</th>
                <th className="px-5 py-4">Police Station</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 animate-spin" />
                    Loading officers...
                  </td>
                </tr>
              ) : filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                    No officers found.
                  </td>
                </tr>
              ) : filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {officer.full_name}
                    </p>
                    <p className="text-xs text-slate-500">{officer.email}</p>
                    <p className="text-xs text-slate-500">{officer.phone}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600">
                    {officer.user_id}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-800">{officer.designation}</p>
                    <p className="text-xs text-slate-500">{officer.department}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="flex items-center gap-1 text-slate-800">
                      <MapPin size={14} />
                      {officer.police_station_name || 'Not assigned'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {officer.district || ''}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[officer.status] || STATUS_STYLES.INACTIVE}`}>
                      {officer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(officer)}
                        title="Edit officer"
                        className="rounded-lg border border-slate-200 p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      {officer.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => changeStatus(officer)}
                          title={officer.status === 'ACTIVE' ? 'Deactivate officer' : 'Activate officer'}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        >
                          {officer.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          Showing {filteredOfficers.length} of {officers.length} officers
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Officer' : 'Add New Officer'}
                </h2>
                <p className="text-xs text-slate-500">
                  Enter the officer's account and posting details.
                </p>
              </div>
              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <input required name="full_name" value={form.full_name} onChange={handleChange} minLength={2} maxLength={120} className="form-input" placeholder="Officer full name" />
                </Field>
                <Field label="Email Address">
                  <input required type="email" name="email" value={form.email} onChange={handleChange} maxLength={190} className="form-input" placeholder="officer@example.com" />
                </Field>
                <Field label="Mobile Number">
                  <input required name="phone" value={form.phone} onChange={handleChange} inputMode="numeric" maxLength={10} pattern="[0-9]{10}" className="form-input" placeholder="10-digit mobile number" />
                </Field>
                <Field label={editingId ? 'New Password (optional)' : 'Password'}>
                  <input required={!editingId} type="password" name="password" value={form.password} onChange={handleChange} minLength={12} maxLength={128} className="form-input" placeholder={editingId ? 'Leave blank to keep current password' : 'Minimum 12 characters'} />
                </Field>
                <Field label="Designation">
                  <input required name="designation" value={form.designation} onChange={handleChange} maxLength={100} className="form-input" placeholder="e.g. Sub Inspector" />
                </Field>
                <Field label="Department">
                  <input required name="department" value={form.department} onChange={handleChange} maxLength={100} className="form-input" placeholder="e.g. Crime Branch" />
                </Field>
                <Field label="Police Station">
                  <select required name="police_station_id" value={form.police_station_id} onChange={handleChange} className="form-input">
                    <option value="">Select police station</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} - {station.district}
                      </option>
                    ))}
                  </select>
                </Field>
                {editingId && (
                  <Field label="Account Status">
                    <select name="status" value={form.status} onChange={handleChange} className="form-input">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </Field>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || stations.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Officer'}
                </button>
              </div>

              {stations.length === 0 && (
                <p className="text-sm text-red-600">
                  No active police stations are available. Add or activate a station first.
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          background: white;
        }
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
