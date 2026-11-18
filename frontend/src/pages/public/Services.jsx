import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileText, History, Info, Mail, Paperclip, Search, LayoutGrid } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const SERVICES = [
  { icon: FileText, title: 'Complaint Registration', description: 'Citizens will be able to submit complaints digitally through a secure portal.' },
  { icon: Search, title: 'Status Tracking', description: 'Citizens will be able to check the progress of submitted complaints using their reference information.' },
  { icon: Paperclip, title: 'Evidence Submission', description: 'Citizens will be able to attach relevant photographs and documents to support their complaints.' },
  { icon: History, title: 'Complaint History', description: 'Citizens will be able to view an archive of their previously submitted complaints.' },
  { icon: Mail, title: 'Email Notifications', description: 'Citizens will receive automated notifications regarding complaint registration and status transitions.' },
  { icon: ClipboardList, title: 'Administrative Command', description: 'Authorised personnel will be able to review and manage complaints through their respective dashboards.' },
];

export default function Services() {
  usePageTitle('Services');

  return (
    <div className="bg-slate-950 text-slate-300 selection:bg-brand-500/30 min-h-screen">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="outline" className="mb-6 border-brand-500/50 text-brand-400 bg-brand-500/10 backdrop-blur-sm">
            <LayoutGrid className="w-3 h-3 mr-2" /> Service_Catalog
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Planned <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">Services</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-400 max-w-3xl mx-auto">
            An overview of the digital services the platform is architected to provide once its development phases are complete.
          </p>
        </div>
      </div>

      <Section labelledBy="services-heading" className="py-24">
        <h2 id="services-heading" className="sr-only">Service list</h2>

        <div role="note" className="mx-auto flex max-w-4xl items-start gap-4 rounded-xl border border-brand-500/30 bg-brand-500/5 p-5 text-sm leading-relaxed text-slate-300 backdrop-blur-sm mb-12">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden="true" />
          <p>
            <span className="font-semibold text-white">System Status: Planned.</span> These services describe the intended scope of the educational prototype and will become available as development phases complete.
          </p>
        </div>

        <ul className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.title} className="group relative rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-brand-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
              <div className="relative">
                <span className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-xl text-brand-400 mb-5 group-hover:scale-110 transition-transform border border-slate-700">
                  <service.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="md" labelledBy="services-cta-heading" className="bg-slate-900 border-t border-slate-800 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-8 sm:p-12 text-center shadow-2xl max-w-4xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-brand-600/20 blur-[80px] rounded-full pointer-events-none" />
          <h2 id="services-cta-heading" className="text-2xl font-bold text-white mb-4">Want to see how it fits together?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Read the step-by-step operational process, or browse the frequently asked questions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button as={Link} to="/how-it-works" size="lg" className="bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(var(--brand-600-rgb),0.3)] border border-brand-500/50" rightIcon={ArrowRight}>
              How It Works
            </Button>
            <Button as={Link} to="/faq" variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Read the FAQ
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}