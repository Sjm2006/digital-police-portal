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