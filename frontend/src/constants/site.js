export const SITE_NAME = 'Digital Police Portal';
export const EMERGENCY_NUMBER = '112';

export const MAIN_NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export const AUTH_LINKS = {
  login: '/login',
  register: '/register',
};

export const FOOTER_SERVICES = [
  'Online complaint registration',
  'Complaint status tracking',
  'Evidence submission',
  'Complaint history',
  'Email notifications',
];

// Development-only shortcuts to the Phase 2 dashboard placeholders.
// Remove before any real deployment.
export const PREVIEW_LINKS = [
  { label: 'Citizen', to: '/citizen/dashboard' },
  { label: 'Officer', to: '/officer/dashboard' },
  { label: 'Admin', to: '/admin/dashboard' },
];
