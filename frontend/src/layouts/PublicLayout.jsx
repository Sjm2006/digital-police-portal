
import { Outlet } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-800 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Navbar />

      <main
        id="main-content"
        className="min-w-0 flex-1"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
