import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/forms/PasswordInput';

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Use your registered email address or portal ID to access your account and continue to your services."
    >
      <AuthCard
        title="Sign in"
        description="Secure access for citizens, officers and administrators."
        footer={
          <p className="text-center">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
              Create citizen account
            </Link>
          </p>
        }
      >
        {isSubmitted && (
          <FormMessage variant="success" className="mb-4">
            Demo sign-in succeeded. Connect this form to the PHP session API in the next implementation phase.
          </FormMessage>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email or registered ID"
            name="identifier"
            type="text"
            placeholder="name@example.com"
            required
          />

          <PasswordInput label="Password" name="password" placeholder="Enter your password" required />

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500" />
              Remember me
            </label>

            <Link to="/forgot-password" className="font-medium text-brand-700 hover:text-brand-800">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} leftIcon={LockKeyhole}>
            {isSubmitting ? 'Signing in' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-4 rounded border border-brand-100 bg-brand-50 p-3 text-sm text-brand-800">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Need a secure account?</span>
            <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
              Register now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
