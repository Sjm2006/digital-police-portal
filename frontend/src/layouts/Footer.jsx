
import { Link } from 'react-router-dom';
import { Landmark, Phone, ShieldCheck } from 'lucide-react';

import {
  AUTH_LINKS,
  EMERGENCY_NUMBER,
  FOOTER_SERVICES,
  MAIN_NAV,
  PREVIEW_LINKS,
  SITE_NAME,
} from '../../constants/site';

const LINK_CLASS =
  'text-sm text-slate-300 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] rounded';

const HEADING_CLASS =
  'text-xs font-bold uppercase tracking-[0.16em] text-[#F5A623]';

const NAVIGATION_LINKS = MAIN_NAV.filter((link) =>
  ['/', '/about', '/services', '/how-it-works'].includes(link.to)
);

const SUPPORT_LINKS = [
  MAIN_NAV.find((link) => link.to === '/faq'),
  MAIN_NAV.find((link) => link.to === '/contact'),
  { label: 'Login', to: AUTH_LINKS.login },
  { label: 'Register', to: AUTH_LINKS.register },
].filter(Boolean);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[#E87519] bg-[#102D4D] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#183B63] shadow-lg">
              <Landmark className="h-7 w-7" aria-hidden="true" />
            </span>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-white">
                {SITE_NAME}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F5A623]">
                Citizen Service Portal
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            A digital platform concept designed to make complaint registration,
            status tracking and access to public service information simpler
            and more organised.
          </p>

          <div className="mt-6 rounded-xl border border-white/15 border-l-4 border-l-[#E87519] bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Phone className="h-4 w-4 text-[#F5A623]" aria-hidden="true" />
              Emergency Assistance: {EMERGENCY_NUMBER}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              For immediate emergencies in India, contact the national
              emergency number {EMERGENCY_NUMBER}. This portal is an
              educational prototype and is not an emergency response service.
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="lg:col-span-2">
          <h2 className={HEADING_CLASS}>Explore</h2>

          <ul className="mt-5 space-y-3">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services" className="lg:col-span-3">
          <h2 className={HEADING_CLASS}>Services</h2>

          <ul className="mt-5 space-y-3">
            {FOOTER_SERVICES.map((service) => (
              <li key={service}>
                <Link to="/services" className={LINK_CLASS}>
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer support" className="lg:col-span-3">
          <h2 className={HEADING_CLASS}>Help and Access</h2>

          <ul className="mt-5 space-y-3">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623]"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-slate-300">
              Your information should only be submitted through the appropriate
              official channels. Do not use this prototype for real emergency
              reporting.
            </p>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10 bg-[#0B223B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-slate-400 sm:px-6 lg:px-8">
          <p>
            &copy; {year} {SITE_NAME}. Educational software prototype. Not
            affiliated with, operated by or authorised by any government or
            police department.
          </p>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-semibold text-[#F5A623]">
              Development previews:
            </span>

            {PREVIEW_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded underline underline-offset-2 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
              >
                {link.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
