
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

export default function Register() {
  usePageTitle('Register');

  const navigate = useNavigate();
  const { register, user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    return <Navigate to="/citizen/dashboard" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleDocumentChange(event) {
    setError('');

    const file = event.target.files?.[0];

    if (!file) {
      setDocumentFile(null);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG and PNG documents are allowed.');
      event.target.value = '';
      setDocumentFile(null);
      return;
    }

    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      setError('Document size must not exceed 5 MB.');
      event.target.value = '';
      setDocumentFile(null);
      return;
    }

    setDocumentFile(file);
  }

  function removeDocument() {
    setDocumentFile(null);
    setDocumentType('');

    const fileInput = document.getElementById('document');
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.full_name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    const passwordValid =
      form.password.length >= 12 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /\d/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password);

    if (!passwordValid) {
      setError(
        'Password must contain at least 12 characters, uppercase, lowercase, a number and a symbol.'
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (documentFile && !documentType) {
      setError('Please select your document type.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append('full_name', form.full_name.trim());
      payload.append('email', form.email.trim().toLowerCase());
      payload.append('phone', form.phone.trim());
      payload.append('password', form.password);

      if (documentFile) {
        payload.append('document_type', documentType);
        payload.append('document', documentFile);
      }

      await register(payload);

      navigate('/citizen/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/10 disabled:bg-slate-100';

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800 text-white shadow-lg">
            <ShieldCheck size={34} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            Citizen Registration
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create your account to access the Digital Police Portal.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your details to register as a citizen.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  value={form.full_name}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="Enter your email address"
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={updateField}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Minimum 12 characters"
                  className={`${inputClass} pr-12`}
                  disabled={submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Use uppercase, lowercase, a number and a symbol.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Re-enter your password"
                  className={`${inputClass} pr-12`}
                  disabled={submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Optional identity document upload */}
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText size={18} className="text-navy-700" />
                  Identity Document Verification
                  <span className="font-normal text-slate-400">(Optional)</span>
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload an identity document to help verify your citizen account.
                  Your document will be reviewed by an administrator.
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="documentType" className="mb-2 block text-sm font-medium text-slate-700">
                  Document Type
                </label>

                <select
                  id="documentType"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/10"
                >
                  <option value="">Select document type</option>
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="DRIVING_LICENSE">Driving Licence</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {!documentFile ? (
                <label
                  htmlFor="document"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-navy-600 hover:bg-slate-100"
                >
                  <Upload className="mb-2 h-7 w-7 text-navy-700" />

                  <span className="text-sm font-semibold text-slate-700">
                    Click to upload identity document
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    PDF, JPG or PNG · Maximum 5 MB
                  </span>

                  <input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleDocumentChange}
                    disabled={submitting}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-7 w-7 shrink-0 text-green-700" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-green-800">
                        {documentFile.name}
                      </p>
                      <p className="text-xs text-green-700">
                        {(documentFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeDocument}
                    disabled={submitting}
                    aria-label="Remove uploaded document"
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                  >
                    <X size={19} />
                  </button>
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Documents are optional during registration. If uploaded,
                their verification status will initially be Pending.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-navy-800 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <CheckCircle2 size={15} />
          Your account information is submitted securely.
        </p>
      </div>
    </section>
  );
}
