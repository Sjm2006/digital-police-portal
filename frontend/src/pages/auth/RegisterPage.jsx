import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/forms/PasswordInput';

export default function RegisterPage() {
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
      title="Create your account"
      subtitle="Register as a citizen to submit complaints, track progress and stay informed about your case updates."
    >
      <AuthCard
        title="Citizen registration"
        description="Fields below establish your secure portal access."
        footer={
          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
              Sign in instead
            </Link>
          </p>
        }
      >
        {isSubmitted && (
          <FormMessage variant="success" className="mb-4">
            Registration preview complete. The real backend registration hook will be connected in a later batch.
          </FormMessage>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Full name" name="fullName" type="text" placeholder="Enter your full name" required />
          <Input label="Email address" name="email" type="email" placeholder="name@example.com" required />
          <Input label="Mobile number" name="mobile" type="tel" placeholder="9876543210" required />
          <PasswordInput label="Password" name="password" placeholder="Create a password" required />
          <PasswordInput label="Confirm password" name="confirmPassword" placeholder="Re-enter your password" required />

          <label className="flex items-start gap-2 rounded border border-line bg-brand-50/50 p-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500" required />
            <span>I agree to the terms and conditions for using this portal.</span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} leftIcon={UserPlus}>
            {isSubmitting ? 'Creating account' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4 rounded border border-gold-200 bg-gold-50 p-3 text-sm text-ink">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Already set up?</span>
            <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
              Continue to sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
