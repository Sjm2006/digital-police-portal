import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass, LogIn, UserPlus } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';
import RoutePlaceholder from '../pages/RoutePlaceholder';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import Button from '../components/ui/Button';

// Public pages that are still placeholders (How It Works, FAQ and Contact arrive in Batch 3).
const PUBLIC_PLACEHOLDERS = [
  {
    path: 'how-it-works',
    title: 'How It Works',
    description: 'The complaint management process, step by step.',
    expectedPhase: 'Phase 3',
  },
  {
    path: 'faq',
    title: 'FAQ',
    description: 'Frequently asked questions about the portal.',
    expectedPhase: 'Phase 3',
  },
  {
    path: 'contact',
    title: 'Contact',
    description: 'Ways to get in touch with the project team.',
    expectedPhase: 'Phase 3',
  },
  {
    path: 'login',
    title: 'Login',
    description: 'Sign in to your portal account.',
    expectedPhase: 'Phase 5 (Authentication and Role Management)',
    statusLabel: 'Not yet available',
    heading: 'Login is not available yet',
    icon: LogIn,
  },
  {
    path: 'register',
    title: 'Register',
    description: 'Create a citizen account.',
    expectedPhase: 'Phase 5 (Authentication and Role Management)',
    statusLabel: 'Not yet available',
    heading: 'Registration is not available yet',
    icon: UserPlus,
  },
];

const CITIZEN_PAGES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your complaints and their progress.',
    expectedPhase: 'Phase 6',
    plannedItems: ['Total complaints', 'Pending complaints', 'Resolved complaints', 'Recent complaints'],
  },
  {
    path: 'complaints',
    title: 'My Complaints',
    description: 'Submit new complaints and track existing ones.',
    expectedPhase: 'Phase 6',
  },
  {
    path: 'profile',
    title: 'Profile',
    description: 'Manage your personal details.',
    expectedPhase: 'Phase 6',
  },
];

const OFFICER_PAGES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your assigned complaints and activity.',
    expectedPhase: 'Phase 7',
    plannedItems: ['Assigned complaints', 'Pending investigations', 'Resolved cases', 'Recent activity'],
  },
  {
    path: 'complaints',
    title: 'Assigned Complaints',
    description: 'Review and update the complaints assigned to you.',
    expectedPhase: 'Phase 7',
  },
  {
    path: 'profile',
    title: 'Profile',
    description: 'Manage your officer profile.',
    expectedPhase: 'Phase 7',
  },
];

const ADMIN_PAGES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    description: 'System-wide overview for administrators.',
    expectedPhase: 'Phase 8',
    plannedItems: [
      'Total citizens',
      'Total officers',
      'Total complaints',
      'Pending complaints',
      'Resolved complaints',
      'Recent activity',
    ],
  },
  {
    path: 'users',
    title: 'Users',
    description: 'Manage citizen accounts.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'officers',
    title: 'Officers',
    description: 'Manage police officer accounts.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'complaints',
    title: 'Complaints',
    description: 'Supervise and assign all complaints.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'categories',
    title: 'Categories',
    description: 'Manage complaint categories.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'stations',
    title: 'Stations',
    description: 'Manage police stations.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'reports',
    title: 'Reports',
    description: 'Analytics and reports.',
    expectedPhase: 'Phase 8',
  },
  {
    path: 'settings',
    title: 'Settings',
    description: 'System settings.',
    expectedPhase: 'Phase 8',
  },
];

const renderPages = (section, pages) =>
  pages.map(({ path, index, ...pageProps }) => (
    <Route
      key={path ?? 'index'}
      index={index}
      path={path}
      element={<RoutePlaceholder section={section} {...pageProps} />}
    />
  ));

function NotFound() {
  return (
    <RoutePlaceholder
      section="public"
      title="Page not found"
      description="The page you requested does not exist or has been moved."
      statusLabel="Error 404"
      heading="We could not find that page"
      message="Check the address for typing errors, or return to the home page."
      icon={Compass}
      breadcrumbs={[]}
      actions={
        <Button as={Link} to="/" variant="primary">
          Back to home
        </Button>
      }
    />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        {renderPages('public', PUBLIC_PLACEHOLDERS)}
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {renderPages('citizen', CITIZEN_PAGES)}
      </Route>

      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {renderPages('officer', OFFICER_PAGES)}
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {renderPages('admin', ADMIN_PAGES)}
      </Route>
    </Routes>
  );
}