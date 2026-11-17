import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';

export default function PasswordInput({ label = 'Password', id, error, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...rest}
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        error={error}
        inputClassName="pr-10"
      />

      <button
        type="button"
        onClick={() => setShowPassword((visible) => !visible)}
        className="absolute right-3 top-[2.2rem] inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
