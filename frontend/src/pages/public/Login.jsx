import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, LockKeyhole, Mail, ArrowRight, LoaderCircle, AlertCircle, Terminal, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import Badge from '../../components/ui/Badge';

const roleRoutes = {
  CITIZEN: '/citizen/dashboard',
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer/dashboard',
};

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoaderCircle className="h-10 w-10 animate-spin text-brand-500" />
      </div>
    );
  }

  if (user) return <Navigate to={roleRoutes[user.role] || '/'} replace />;

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
      setError(err.response?.data?.message || err.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden selection:bg-brand-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-brand-500 shadow-[0_0_30px_rgba(var(--brand-600-rgb),0.2)]">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">System Access</h1>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Digital Police Portal</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-semibold text-slate-200">Authenticate</h2>
            <Badge variant="outline" className="border-brand-500/30 text-brand-400 bg-brand-500/10 font-mono text-[10px]">
              Secure_Node
            </Badge>
          </div>

          {error && (
            <div role="alert" className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">Email or User ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter ID"
                  disabled={submitting}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">Passkey</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={submitting}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_15px_rgba(var(--brand-600-rgb),0.2)]"
            >
              {submitting ? (
                <><LoaderCircle className="h-5 w-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Initialize Session <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-sm text-slate-400">
              No citizen account?{' '}
              <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">Request Access</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-mono text-slate-600">
          <ShieldAlert size={14} /> Connection Encrypted. Do not share credentials.
        </p>
      </div>
    </section>
  );
}