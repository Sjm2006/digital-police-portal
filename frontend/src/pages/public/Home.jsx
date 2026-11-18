import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Hash,
  Paperclip,
  Search,
  ShieldCheck,
  UserPlus,
  Lock,
  Cpu,
  Activity
} from 'lucide-react';

import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import SectionHeading from '../../components/common/SectionHeading';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const REGISTER_PATH = '/register';
const TRACK_PATH = '/citizen/complaints';

const JOURNEY = [
  { icon: FileText, label: 'Complaint submitted by citizen', status: 'Secured' },
  { icon: ClipboardList, label: 'Complaint reviewed by authorised personnel', status: 'Processing' },
  { icon: CheckCircle2, label: 'Complaint status updated', status: 'Verified' },
  { icon: Bell, label: 'Citizen receives a status notification', status: 'Dispatched' },
];

const FEATURES = [
  {
    icon: Lock,
    title: 'Encrypted Submission',
    description: 'Submit complaint information through a secure, structured digital pipeline ensuring data integrity.',
  },
  {
    icon: Activity,
    title: 'Real-time Tracking',
    description: 'Monitor the lifecycle of your case with transparent, real-time status updates via the citizen portal.',
  },
  {
    icon: Paperclip,
    title: 'Digital Evidence Locker',
    description: 'Securely upload and attach supporting documents and multimedia evidence for official review.',
  },
  {
    icon: Eye,
    title: 'Transparent Case Updates',
    description: 'View authorized status changes and relevant analytical updates through your secure account.',
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Create Account', description: 'Register with verified credentials to access the secure portal.' },
  { icon: FileText, title: 'Submit Details', description: 'Enter incident information and upload required digital evidence.' },
  { icon: Hash, title: 'Generate Reference', description: 'A unique cryptographic reference ID is generated for tracking.' },
  { icon: ClipboardList, title: 'Officer Review', description: 'Complaints are routed to authorised personnel for processing.' },
  { icon: Bell, title: 'Instant Alerts', description: 'Receive automated notifications regarding status changes.' },
  { icon: Search, title: 'Track Progress', description: 'Return to your dashboard to view live case updates.' },
];

const OBJECTIVES = [
  {
    title: 'Accessible Citizen Services',
    description: 'Provide a high-availability digital interface for citizens to seamlessly access portal services.',
  },
  {
    title: 'Structured Data Management',
    description: 'Maintain encrypted, structured complaint data to support efficient administrative review.',
  },
  {
    title: 'Identity Verification',
    description: 'Support secure citizen registration and the digital submission of documents for validation.',
  },
  {
    title: 'Comprehensive Visibility',
    description: 'Allow citizens to view holistic complaint metrics and follow status transitions.',
  },
  {
    title: 'Role-Based Access Control',
    description: 'Ensure strict data segregation with dedicated portals for citizens, officers, and administrators.',
  },
];

export default function Home() {
  usePageTitle('Home');

  return (
    <div className="bg-slate-950 text-slate-300 selection:bg-brand-500/30">
      
      {/* Hero Section */}
      <Section spacing="lg" className="relative overflow-hidden border-b border-slate-800">
        {/* Background Tech Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-brand-500/50 text-brand-400 bg-brand-500/10 backdrop-blur-sm" dot>
                <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse mr-2" />
                System Online • Academic Prototype
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                v1.0.0 // Secure Node
              </span>
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Next-Gen
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500 mt-2">
                Citizen-Police Interface.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              The Digital Police Portal is an advanced academic prototype engineered to unify citizen registration, encrypted complaint management, and real-time status tracking within a single, secure digital ecosystem.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                as={Link}
                to={REGISTER_PATH}
                size="lg"
                className="bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(var(--brand-600-rgb),0.3)] transition-all duration-300 border border-brand-500/50"
                rightIcon={ArrowRight}
              >
                Initialize Account
              </Button>

              <Button
                as={Link}
                to={TRACK_PATH}
                variant="secondary"
                size="lg"
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white backdrop-blur-sm"
                leftIcon={Search}
              >
                Access Terminal
              </Button>
            </div>

            <div className="mt-8 flex items-start gap-3 border-t border-slate-800 pt-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
              <p className="max-w-lg text-sm leading-relaxed text-slate-500">
                Developed for educational and demonstration purposes. This system is a conceptual prototype and is <strong className="text-slate-400">not</strong> an official Government portal.
              </p>
            </div>
          </div>

          {/* High-Tech Workflow Panel (Glassmorphism) */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/50 pb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-brand-400 flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> System Workflow
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">Complaint Lifecycle</h2>
                </div>
                <Badge size="sm" className="bg-slate-800 text-slate-300 border-slate-700">Live Node</Badge>
              </div>

              <ol className="mt-7 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                {JOURNEY.map(({ icon: Icon, label, status }, index) => (
                  <li key={label} className="relative flex items-center gap-4 group/item">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-600 text-brand-400 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover/item:border-brand-500 transition-colors">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 group-hover/item:border-slate-600 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                          Step {String(index + 1).padStart(2, '0')}
                        </p>
                        <span className="text-[10px] font-mono text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded">
                          {status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        {label}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* Portal Services - Dark Grid */}
      <Section tone="transparent" labelledBy="overview-heading" className="bg-slate-950 py-24">
        <SectionHeading
          id="overview-heading"
          eyebrow="System Capabilities"
          title="Enterprise-Grade Modules"
          className="text-white"
          description="Explore the key architectural components engineered for the Digital Police Portal."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="group relative rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-brand-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
              <div className="relative">
                <span className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-xl text-brand-400 mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* How it works - Dark Cards */}
      <Section tone="dark" labelledBy="steps-heading" className="bg-slate-900 border-y border-slate-800 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <SectionHeading
            id="steps-heading"
            eyebrow="Operational Protocol"
            title="System Architecture"
            className="text-white mb-0"
            description="A structured, secure process connecting citizen registration and complaint resolution."
          />
          <Button
            as={Link}
            to="/how-it-works"
            variant="outline"
            className="mt-6 md:mt-0 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            rightIcon={ArrowRight}
          >
            View Full Schema
          </Button>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative p-6 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 text-slate-400 font-mono text-sm border border-slate-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <step.icon className="w-5 h-5 text-brand-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Project objectives - Clean & Structured */}
      <Section tone="transparent" labelledBy="why-heading" className="bg-slate-950 py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="why-heading"
              eyebrow="Core Objectives"
              title="Redefining the Digital Experience"
              className="text-white"
              description="The project focuses on modernizing the accessibility, structural integrity, and transparency of citizen-facing services."
            />
          </div>

          <ul className="space-y-4 lg:col-span-7">
            {OBJECTIVES.map((item) => (
              <li key={item.title} className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/20 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-brand-400" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Emergency Info & CTA */}
      <div className="bg-slate-900 border-t border-slate-800">
        <Section spacing="sm" className="border-b border-slate-800/50">
          <EmergencyNotice />
        </Section>

        <Section labelledBy="cta-heading" spacing="lg" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-slate-900 to-slate-900 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Ready to access the portal?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Create a citizen account to explore the available services and monitor your complaint lifecycle through a secure, unified dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as={Link}
                to={REGISTER_PATH}
                size="lg"
                className="bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(var(--brand-600-rgb),0.3)] border border-brand-500/50"
                rightIcon={ArrowRight}
              >
                Register as a Citizen
              </Button>
              <Button
                as={Link}
                to="/how-it-works"
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Documentation
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}