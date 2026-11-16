import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  Settings,
  Tags,
  UserCog,
  Users,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';

const SIDEBAR_ID = 'admin-sidebar';
const ROLE_LABEL = 'Administration';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Officers', to: '/admin/officers', icon: UserCog },
  { label: 'Complaints', to: '/admin/complaints', icon: FileText },
  { label: 'Categories', to: '/admin/categories', icon: Tags },
  { label: 'Stations', to: '/admin/stations', icon: Building2 },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-surface text-slate-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Sidebar id={SIDEBAR_ID} title={ROLE_LABEL} items={NAV_ITEMS} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          sectionLabel={ROLE_LABEL}
          onMenuClick={() => setSidebarOpen(true)}
          isMenuOpen={sidebarOpen}
          menuControlsId={SIDEBAR_ID}
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}