
import { useEffect, useState } from 'react';
import {
  User, Mail, Phone, Shield, Building2, MapPin,
  Calendar, Clock, Lock, Save, RefreshCw
} from 'lucide-react';
import apiClient from '../../services/apiClient';

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
        err.response?.data?.message ||
        'Unable to update profile.'
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
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <Icon size={16} />
        {label}
      </div>
      <p className="font-medium text-gray-800">
        {value || 'Not available'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-gray-600">
        <RefreshCw className="animate-spin" size={20} />
        Loading officer profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error || 'Officer profile could not be loaded.'}
        <button
          onClick={loadProfile}
          className="ml-3 font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Officer Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your official information and manage your account.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Shield size={30} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile.full_name}
            </h2>
            <p className="text-sm text-gray-500">
              {profile.designation || 'Police Officer'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Officer ID: {profile.user_id}
            </p>
          </div>

          <div className="sm:ml-auto">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              profile.status === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {profile.status}
            </span>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Official Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Account Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your official designation and police station are managed by the administrator.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              value={profile.email || ''}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5">
          <h3 className="mb-1 font-semibold text-gray-900">
            Change Password
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Leave these fields empty if you do not want to change your password.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
