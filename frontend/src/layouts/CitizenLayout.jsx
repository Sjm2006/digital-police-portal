import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FileText, LayoutDashboard, UserCircle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';

const SIDEBAR_ID = 'citizen-sidebar';
const ROLE_LABEL = 'Citizen Portal';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/citizen/dashboard', icon: LayoutDashboard },
  { label: 'My Complaints', to: '/citizen/complaints', icon: FileText },
  { label: 'Profile', to: '/citizen/profile', icon: UserCircle },
];

export default function CitizenLayout() {
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