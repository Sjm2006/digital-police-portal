import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
  Lock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

import apiClient from '../../services/apiClient';

export default function CitizenProfile() {
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.get('/profile.php');
      const data = response?.data?.data?.profile;

      if (!data) {
        throw new Error('Profile information not found.');
      }

      setProfile(data);

      setForm((previous) => ({
        ...previous,
        full_name: data.full_name || '',
        phone: data.phone || '',
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (form.new_password && form.new_password.length < 8) {
      setError('New password must contain at least 8 characters.');
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      setSaving(true);

      const response = await apiClient.patch('/profile.php', {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        current_password: form.current_password,
        new_password: form.new_password,
      });

      setSuccess(
        response?.data?.message || 'Profile updated successfully.'
      );

      setProfile((previous) => ({
        ...previous,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
      }));

      setForm((previous) => ({
        ...previous,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Not available';

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100';

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="animate-spin" size={18} />
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 text-sm text-rose-700">
        <AlertCircle className="mb-2" size={20} />
        {error || 'Profile could not be loaded.'}
        <button
          onClick={fetchProfile}
          className="mt-3 block font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and update your personal information and account security.
        </p>
      </div>

      {/* Account Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <User size={26} />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {profile.full_name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Citizen ID: {profile.user_id}
            </p>
          </div>

          <span
            className={`w-fit rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
              profile.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-rose-50 text-rose-700 ring-rose-200'
            }`}
          >
            {profile.status}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
            <User className="text-blue-600" size={18} />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500">
                Update your registered personal details.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className={inputClass}
                required
                maxLength={120}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={profile.email || ''}
                  readOnly
                  className={`${inputClass} !mt-1 bg-slate-100 pl-9 text-slate-500`}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} !mt-1 pl-9`}
                  required
                  maxLength={16}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Citizen ID
              </label>
              <input
                value={profile.user_id || ''}
                readOnly
                className={`${inputClass} bg-slate-100 text-slate-500`}
              />
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
            <ShieldCheck className="text-blue-600" size={18} />
            <h2 className="text-sm font-semibold text-slate-900">
              Account Information
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 text-slate-400" size={16} />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Registered On
                </p>
                <p className="mt-0.5 text-sm text-slate-800">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 text-slate-400" size={16} />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Last Login
                </p>
                <p className="mt-0.5 text-sm text-slate-800">
                  {profile.last_login_at
                    ? formatDate(profile.last_login_at)
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Password */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
            <Lock className="text-blue-600" size={18} />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Change Password
              </h2>
              <p className="text-xs text-slate-500">
                Leave these fields blank if you do not want to change your
                password.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                className={inputClass}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}