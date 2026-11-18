import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Phone, LockKeyhole, Eye, EyeOff, ArrowRight, LoaderCircle, AlertCircle, CheckCircle2, FileText, Upload, X, ShieldPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

export default function Register() {
  usePageTitle('Register');
  const navigate = useNavigate();
  const { register, user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950"><LoaderCircle className="h-10 w-10 animate-spin text-brand-500" /></div>;
  }

  if (user) return <Navigate to="/citizen/dashboard" replace />;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDocumentChange(event) {
    setError('');
    const file = event.target.files?.[0];
    if (!file) { setDocumentFile(null); return; }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG and PNG documents are allowed.');
      event.target.value = ''; setDocumentFile(null); return;
    }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      setError('Document size must not exceed 5 MB.');
      event.target.value = ''; setDocumentFile(null); return;
    }
    setDocumentFile(file);
  }

  function removeDocument() {
    setDocumentFile(null); setDocumentType('');
    const fileInput = document.getElementById('document');
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Validation logic remains identical to your original code
    if (form.full_name.trim().length < 2) return setError('Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address.');
    if (!/^\d{10}$/.test(form.phone.trim())) return setError('Enter a valid 10-digit mobile number.');
    
    const passwordValid = form.password.length >= 12 && /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) && /\d/.test(form.password) && /[^A-Za-z0-9]/.test(form.password);
    if (!passwordValid) return setError('Password must contain at least 12 characters, uppercase, lowercase, a number and a symbol.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (documentFile && !documentType) return setError('Please select your document type.');

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
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50';
  const labelClass = 'mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400';

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden selection:bg-brand-500/30">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-brand-500 shadow-[0_0_30px_rgba(var(--brand-600-rgb),0.2)]">
            <ShieldPlus size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Identity Provisioning</h1>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Citizen Registration</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-lg font-semibold text-slate-200">Create Profile</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your details to initialize a new citizen account.</p>
          </div>

          {error && (
            <div role="alert" className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full_name" className={labelClass}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="full_name" name="full_name" type="text" value={form.full_name} onChange={updateField} placeholder="Enter full legal name" className={inputClass} disabled={submitting} required />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="name@domain.com" className={inputClass} disabled={submitting} required />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="phone" name="phone" type="tel" maxLength={10} value={form.phone} onChange={updateField} placeholder="10-digit number" className={inputClass} disabled={submitting} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className={labelClass}>Passkey</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} placeholder="Minimum 12 characters" className={`${inputClass} pr-10`} disabled={submitting} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm Passkey</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={updateField} placeholder="Re-enter passkey" className={`${inputClass} pr-10`} disabled={submitting} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-slate-800/30 border border-slate-700/50 p-3">
               <p className="text-xs text-slate-500 font-mono">Sec_Req: ≥12 chars, uppercase, lowercase, number, & symbol.</p>
            </div>

            <div className="border-t border-slate-800 pt-5 mt-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <FileText size={18} className="text-brand-500" /> Identity Verification
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase ml-auto border border-slate-700">Optional</span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">Upload an identity document to expedite admin verification.</p>
              </div>

              <div className="mb-4">
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none"
                >
                  <option value="">Select Document Protocol</option>
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="DRIVING_LICENSE">Driving Licence</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {!documentFile ? (
                <label htmlFor="document" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-4 py-8 text-center transition hover:border-brand-500/50 hover:bg-slate-900 group">
                  <Upload className="mb-2 h-7 w-7 text-slate-500 group-hover:text-brand-400 transition-colors" />
                  <span className="text-sm font-semibold text-slate-300">Click to upload document</span>
                  <span className="mt-1 text-xs text-slate-500 font-mono">PDF, JPG, PNG // MAX 5MB</span>
                  <input id="document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentChange} disabled={submitting} className="hidden" />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-7 w-7 shrink-0 text-brand-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-300">{documentFile.name}</p>
                      <p className="text-xs text-brand-500/70 font-mono">{(documentFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeDocument} disabled={submitting} className="rounded-lg p-2 text-red-400 hover:bg-red-500/20 transition-colors">
                    <X size={19} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_15px_rgba(var(--brand-600-rgb),0.2)]"
            >
              {submitting ? (
                <><LoaderCircle className="h-5 w-5 animate-spin" /> Initializing Profile...</>
              ) : (
                <>Register Identity <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-sm text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">Authenticate</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-mono text-slate-600">
          <CheckCircle2 size={14} className="text-brand-500" /> Data transmitted via secure encryption.
        </p>
      </div>
    </section>
  );
}