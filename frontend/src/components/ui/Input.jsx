import { forwardRef, useId } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const FIELD_BASE =
  'block w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 ' +
  'transition-colors duration-150 focus:outline-none focus:ring-1 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const FIELD_OK = 'border-slate-300 focus:border-navy-700 focus:ring-navy-700';
const FIELD_ERROR = 'border-red-600 focus:border-red-600 focus:ring-red-600';

const Input = forwardRef(function Input(
  {
    as: Tag = 'input',
    id,
    label,
    hint,
    error,
    required = false,
    leftIcon: LeftIcon,
    className,
    inputClassName,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-800">
          {label}
          {required && (
            <span className="ml-0.5 text-red-700" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
        )}
        <Tag
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(FIELD_BASE, error ? FIELD_ERROR : FIELD_OK, LeftIcon && 'pl-9', inputClassName)}
          {...rest}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;