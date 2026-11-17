
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const roleRoutes = {
  CITIZEN: '/citizen/dashboard',
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer/dashboard',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-navy-700" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email/User ID and password.');
      return;
    }

    setSubmitting(true);

    try {
      const loggedInUser = await login(identifier.trim(), password);

      const destination = roleRoutes[loggedInUser.role];

      if (!destination) {
        setError('Your account has an unsupported role.');
        return;
      }

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to sign in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800 text-white shadow-lg">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to access the Digital Police Portal
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your registered login details below.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address or User ID
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="Enter email or User ID"
                  disabled={submitting}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/10 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={submitting}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/10 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-navy-800"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Don't have a citizen account?{' '}
              <Link
                to="/register"
                className="font-semibold text-navy-800 hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Secure access to the Digital Police Portal.
          Please keep your login credentials confidential.
        </p>
      </div>
    </section>
  );
}
