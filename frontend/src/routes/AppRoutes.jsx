
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';

import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';

import RoutePlaceholder from '../pages/RoutePlaceholder';

import Complaints from '../pages/citizen/Complaints';
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenProfile from '../pages/citizen/CitizenProfile';

import OfficerDashboard from '../pages/officer/OfficerDashboard';
import OfficerComplaints from '../pages/officer/OfficerComplaints';
import OfficerProfile from '../pages/officer/OfficerProfile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageOfficers from '../pages/admin/ManageOfficers';
import AdminComplaints from '../pages/admin/AdminComplaints';

import {
  AdminCategories,
  AdminStations,
  AdminReports,
  AdminSettings,
} from '../pages/admin/AdminDemoPages';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import HowItWorks from '../pages/public/HowItWorks';
import FAQ from '../pages/public/FAQ';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

import Button from '../components/ui/Button';

// Citizen Pages
const CITIZEN_PAGES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your complaints and their progress.',
    expectedPhase: 'Phase 6',
    plannedItems: [
      'Total complaints',
      'Pending complaints',
      'Resolved complaints',
      'Recent complaints',
    ],
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

// Officer Pages
const OFFICER_PAGES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your assigned complaints and activity.',
    expectedPhase: 'Phase 7',
    plannedItems: [
      'Assigned complaints',
      'Pending investigations',
      'Resolved cases',
      'Recent activity',
    ],
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

// Admin Pages
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

// Reusable Route Renderer
const renderPages = (section, pages) =>
  pages.map(({ path, index, ...pageProps }) => (
    <Route
      key={path ?? 'index'}
      index={index}
      path={path}
      element={
        <RoutePlaceholder
          section={section}
          {...pageProps}
        />
      }
    />
  ));

// 404 Page
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

// Main Application Routes
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
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Citizen Routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="profile" element={<CitizenProfile />} />

        {renderPages(
          'citizen',
          CITIZEN_PAGES.filter(
            (page) =>
              page.path !== 'dashboard' &&
              page.path !== 'complaints' &&
              page.path !== 'profile'
          )
        )}
      </Route>

      {/* Officer Routes */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="complaints" element={<OfficerComplaints />} />
        <Route path="profile" element={<OfficerProfile />} />

        {renderPages(
          'officer',
          OFFICER_PAGES.filter(
            (page) =>
              page.path !== 'dashboard' &&
              page.path !== 'complaints' &&
              page.path !== 'profile'
          )
        )}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="officers" element={<ManageOfficers />} />
        <Route path="complaints" element={<AdminComplaints />} />

        {/* Admin Demo Pages */}
        <Route path="categories" element={<AdminCategories />} />
        <Route path="stations" element={<AdminStations />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />

        {renderPages(
          'admin',
          ADMIN_PAGES.filter(
            (page) =>
              page.path !== 'users' &&
              page.path !== 'officers' &&
              page.path !== 'complaints' &&
              page.path !== 'categories' &&
              page.path !== 'stations' &&
              page.path !== 'reports' &&
              page.path !== 'settings'
          )
        )}
      </Route>
    </Routes>
  );
}
