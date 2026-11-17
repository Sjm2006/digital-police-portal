import { useRef, useState } from 'react';
import { Info, Send } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const INITIAL_VALUES = { name: '', email: '', subject: '', message: '' };
const FIELD_ORDER = ['name', 'email', 'subject', 'message'];
const MESSAGE_MAX_LENGTH = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value) {
  const text = value.trim();

  switch (name) {
    case 'name':
      if (!text) return 'Enter your full name.';
      if (text.length < 2) return 'Your name must be at least 2 characters.';
      return '';
    case 'email':
      if (!text) return 'Enter your email address.';
      if (!EMAIL_PATTERN.test(text)) return 'Enter a valid email address, for example name@example.com.';
      return '';
    case 'subject':
      if (!text) return 'Enter a subject.';
      if (text.length < 3) return 'The subject must be at least 3 characters.';
      return '';
    case 'message':
      if (!text) return 'Enter your message.';
      if (text.length < 10) return 'Your message must be at least 10 characters.';
      return '';
    default:
      return '';
  }
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'invalid' | 'unavailable'
  const fieldRefs = useRef({});

  const setFieldRef = (name) => (element) => {
    fieldRefs.current[name] = element;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setStatus('idle');

    if (touched[name]) {
      setErrors((previous) => ({ ...previous, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
    setErrors((previous) => ({ ...previous, [name]: validateField(name, value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    FIELD_ORDER.forEach((field) => {
      nextErrors[field] = validateField(field, values[field]);
    });

    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setStatus('invalid');
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    // No backend exists yet, so nothing is sent and nothing is claimed as delivered.
    setStatus('unavailable');
  };

  const handleClear = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === 'invalid' && (
        <div
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          Please correct the highlighted fields and try again.
        </div>
      )}

      {status === 'unavailable' && (
        <div role="status" className="flex items-start gap-3 rounded border border-line bg-surface p-4 text-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden="true" />
          <div>
            <p className="font-semibold text-ink">Submission is not available yet</p>
            <p className="mt-1 leading-relaxed text-slate-700">
              Contact form submission will be available in a future update. Your message has not been sent.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          ref={setFieldRef('name')}
          id="contact-name"
          name="name"
          label="Full name"
          autoComplete="name"
          required
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
        />
        <Input
          ref={setFieldRef('email')}
          id="contact-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
      </div>

      <Input
        ref={setFieldRef('subject')}
        id="contact-subject"
        name="subject"
        label="Subject"
        required
        value={values.subject}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.subject}
      />

      <Input
        ref={setFieldRef('message')}
        as="textarea"
        rows={6}
        id="contact-message"
        name="message"
        label="Message"
        required
        maxLength={MESSAGE_MAX_LENGTH}
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.message}
        hint={`${values.message.length} / ${MESSAGE_MAX_LENGTH} characters`}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" leftIcon={Send}>
          Submit message
        </Button>
        <Button type="button" variant="ghost" onClick={handleClear}>
          Clear form
        </Button>
      </div>
    </form>
  );
}