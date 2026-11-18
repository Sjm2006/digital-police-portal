import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Lock,
  Save,
  RefreshCw,
} from 'lucide-react';
import apiClient from '../../services/apiClient';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100';

export default function OfficerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.get('/profile.php');
      const data = response.data?.data?.profile;

      if (!data) {
        throw new Error('Unable to retrieve officer profile.');
      }

      setProfile(data);
      setForm((previous) => ({
        ...previous,
        full_name: data.full_name || '',
        phone: data.phone || '',
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.new_password && form.new_password.length < 8) {
      setError('New password must contain at least 8 characters.');
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (form.new_password && !form.current_password) {
      setError('Enter your current password to change it.');
      return;
    }

    try {
      setSaving(true);

      await apiClient.patch('/profile.php', {
        full_name: form.full_name,
        phone: form.phone,
        current_password: form.current_password,
        new_password: form.new_password,
      });

      setMessage('Profile updated successfully.');

      setForm((previous) => ({
        ...previous,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));

      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Not available';
    return new Date(value).toLocaleString();
  };

  const Field = ({ label, value, icon: Icon }) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        <Icon size={13} />
        {label}
      </div>
      <p className="text-sm text-slate-800">{value || 'Not available'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
        <RefreshCw className="animate-spin" size={18} />
        Loading officer profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 text-sm text-rose-700">
        {error || 'Officer profile could not be loaded.'}
        <button onClick={loadProfile} className="ml-3 font-semibold underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Officer Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your official information and manage your account.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Account summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Shield size={26} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {profile.full_name}
            </h2>
            <p className="text-xs text-slate-500">
              {profile.designation || 'Police Officer'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Officer ID: {profile.user_id}
            </p>
          </div>

          <div className="sm:ml-auto">
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                profile.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-rose-50 text-rose-700 ring-rose-200'
              }`}
            >
              {profile.status}
            </span>
          </div>
        </div>
      </div>

      {/* Official Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Official Information
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Officer ID" value={profile.user_id} icon={Shield} />
          <Field label="Designation" value={profile.designation} icon={User} />
          <Field label="Department" value={profile.department} icon={Building2} />
          <Field
            label="Police Station"
            value={profile.police_station_name}
            icon={MapPin}
          />
          <Field
            label="Station District"
            value={profile.police_station_district}
            icon={MapPin}
          />
          <Field label="Email Address" value={profile.email} icon={Mail} />
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Account Created"
            value={formatDate(profile.created_at)}
            icon={Calendar}
          />
          <Field
            label="Last Login"
            value={formatDate(profile.last_login_at)}
            icon={Clock}
          />
        </div>
      </section>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Edit Personal Information
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Your official designation and police station are managed by the
            administrator.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Full Name
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Email Address
            </label>
            <input
              value={profile.email || ''}
              disabled
              className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Lock size={15} className="text-slate-500" />
            Change Password
          </h3>
          <p className="mb-3 text-xs text-slate-500">
            Leave these fields empty if you do not want to change your password.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}