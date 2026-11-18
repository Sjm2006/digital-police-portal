
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';

import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';

import RoutePlaceholder from '../pages/RoutePlaceholder';
import Button from '../components/ui/Button';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import HowItWorks from '../pages/public/HowItWorks';
import FAQ from '../pages/public/FAQ';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

import CitizenDashboard from '../pages/citizen/Dashboard';
import Complaints from '../pages/citizen/Complaints';
import OfficerDashboard from '../pages/officer/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';

const AUTH_PLACEHOLDERS = [];

const CITIZEN_PAGES = [
  {
    path: 'profile',
    title: 'Profile',
    description: 'Manage your personal details.',
    expectedPhase: 'Phase 6',
  },
];

const OFFICER_PAGES = [
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
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {renderPages('public', AUTH_PLACEHOLDERS)}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Citizen Routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="complaints" element={<Complaints />} />
        {renderPages('citizen', CITIZEN_PAGES)}
      </Route>

      {/* Officer Routes */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        {renderPages('officer', OFFICER_PAGES)}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {renderPages('admin', ADMIN_PAGES)}
      </Route>
    </Routes>
  );
}
