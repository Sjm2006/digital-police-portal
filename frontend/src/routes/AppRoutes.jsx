import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';

import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';

import RoutePlaceholder from '../pages/RoutePlaceholder';
import Button from '../components/ui/Button';

// Public pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import HowItWorks from '../pages/public/HowItWorks';
import FAQ from '../pages/public/FAQ';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

// Citizen pages
import Complaints from '../pages/citizen/Complaints';
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenProfile from '../pages/citizen/CitizenProfile';

// Officer pages
import OfficerDashboard from '../pages/officer/OfficerDashboard';
import OfficerComplaints from '../pages/officer/OfficerComplaints';
import OfficerProfile from '../pages/officer/OfficerProfile';

// Admin pages
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
      </Route>

      {/* Citizen Routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="profile" element={<CitizenProfile />} />
      </Route>

      {/* Officer Routes */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="complaints" element={<OfficerComplaints />} />
        <Route path="profile" element={<OfficerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="officers" element={<ManageOfficers />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="stations" element={<AdminStations />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
