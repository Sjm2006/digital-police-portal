<<<<<<< HEAD

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
=======
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';

// --- MOCK DATABASE ---
// In a real app, this data comes from your PHP/MySQL backend.
// We use a dummy user here so you can test the success scenario.
const MOCK_USERS = [
  {
    userId: 'CIT-123',
    password: 'password123',
    name: 'John Doe',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', // Placeholder avatar
  }
];

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({ userId: '', password: '', rememberMe: false });
  const [popup, setPopup] = useState({ show: false, type: '', message: '', user: null });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user exists in our mock database
    const foundUser = MOCK_USERS.find(
      (u) => u.userId === formData.userId && u.password === formData.password
    );

    if (foundUser) {
      // SUCCESS POPUP
      setPopup({
        show: true,
        type: 'success',
        message: 'Login successful!',
        user: foundUser,
      });
    } else {
      // ERROR POPUP
      setPopup({
        show: true,
        type: 'error',
        message: 'Invalid User ID or Password. Please try again.',
        user: null,
      });
    }
  };

  const closePopup = () => {
    // If it was a success, redirect to dashboard (or home) after closing
    if (popup.type === 'success') {
      navigate('/citizen/dashboard'); 
    }
    setPopup({ show: false, type: '', message: '', user: null });
  };

  return (
    <>
      <PageIntro
        eyebrow="Welcome Back"
        title="Login to your account"
        description="Access your dashboard to manage complaints and track updates."
      />

      <Section labelledBy="login-form-heading" spacing="md">
        <div className="mx-auto max-w-md">
          <div className="rounded border border-line bg-white p-6 shadow-card sm:p-8">
            <h2 id="login-form-heading" className="text-2xl font-semibold text-brand-800 mb-6 text-center">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID */}
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">
                  User ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    required
                    value={formData.userId}
                    onChange={handleChange}
                    className="block w-full rounded border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. CIT-123"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">Try: CIT-123 / password123</p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* --- CUSTOM POPUP MODAL --- */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
            
            {popup.type === 'success' && popup.user ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-lg font-bold text-slate-800">Welcome, {popup.user.name}!</h3>
                <img 
                  src={popup.user.image} 
                  alt={popup.user.name} 
                  className="mt-4 h-24 w-24 rounded-full border-4 border-brand-100 object-cover shadow-sm"
                />
                <p className="mt-4 text-sm text-slate-600">
                  You have successfully logged into the Digital Police Portal.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                <h3 className="text-lg font-bold text-slate-800">Login Failed</h3>
                <p className="mt-2 text-sm text-slate-600">{popup.message}</p>
              </div>
            )}

            <button
              onClick={closePopup}
              className="mt-6 w-full rounded bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {popup.type === 'success' ? 'Continue to Dashboard' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
>>>>>>> c924c3cc430fc8982a6b4bca63681bf4874498b9
