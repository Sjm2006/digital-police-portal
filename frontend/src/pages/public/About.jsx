import { 
  Bell, 
  CheckCircle2, 
  ClipboardList, 
  Eye, 
  FolderOpen, 
  Info, 
  LayoutDashboard, 
  Paperclip, 
  ShieldCheck, 
  Users,
  ShieldAlert,
  Server,
  Lock
} from 'lucide-react';

import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import SectionHeading from '../../components/common/SectionHeading';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import Badge from '../../components/ui/Badge';

const PURPOSES = [
  {
    icon: ClipboardList,
    title: 'Manual Processing Bottlenecks',
    description: 'Legacy paper-based or in-person handling causes latency and fragmented organization.',
  },
  {
    icon: Eye,
    title: 'Tracking Visibility Gaps',
    description: 'Citizens often experience a lack of visibility into the lifecycle of their submitted reports.',
  },
  {
    icon: FolderOpen,
    title: 'Unstructured Data Silos',
    description: 'Complaint details and supporting evidence become scattered, degrading retrieval efficiency.',
  },
  {
    icon: Bell,
    title: 'Asynchronous Updates',
    description: 'Without automated digital status triggers, updates require manual inquiry loops.',
  },
];

const OBJECTIVES = [
  {
    title: 'High-Availability Access',
    description: 'Deploy a responsive web interface to streamline complaint registration processes.',
  },
  {
    title: 'Lifecycle Transparency',
    description: 'Provide citizens with real-time visibility into the status and progress of their cases.',
  },
  {
    title: 'Structured Data Archival',
    description: 'Maintain centralized, organized storage for complaint details and digital evidence.',
  },
  {
    title: 'Automated Workflows',
    description: 'Engineer a logical, linear path from initial submission through officer review.',
  },
  {
    title: 'Instant Communications',
    description: 'Deploy notification protocols to keep citizens updated on status changes.',
  },
  {
    title: 'Secure Data Handling',
    description: 'Prioritize data integrity and responsible technology use within the system bounds.',
  },
];

const CAPABILITIES = [
  {
    icon: Users,
    title: 'Citizen Interface',
    description: 'A secure dashboard for users to submit reports and track progress.',
  },
  {
    icon: ShieldCheck,
    title: 'Officer Command',
    description: 'A restricted workspace for personnel to review and process assigned cases.',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Control',
    description: 'Root-level tools for system supervision, user management, and category assignment.',
  },
  {
    icon: ClipboardList,
    title: 'Complaint Engine',
    description: 'Core logic for the structured handling of cases from initialization to closure.',
  },
  {
    icon: Paperclip,
    title: 'Evidence Locker',
    description: 'Secure digital vault for attaching and organizing multimedia and documents.',
  },
  {
    icon: Bell,
    title: 'Alert Protocols',
    description: 'Automated email dispatch system for registration and status transitions.',
  },
];

export default function About() {
  usePageTitle('About');

  return (
    <div className="bg-slate-950 text-slate-300 selection:bg-brand-500/30 min-h-screen">
      
      {/* Page Intro / Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 py-20 lg:py-28">
        {/* Background Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="outline" className="mb-6 border-brand-500/50 text-brand-400 bg-brand-500/10 backdrop-blur-sm">
             <Server className="w-3 h-3 mr-2" /> System Documentation
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">Digital Police Portal</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-400 max-w-3xl mx-auto">
            An advanced educational platform engineered to demonstrate how modern technology can optimize complaint management, improve data accessibility, and provide absolute transparency into operational progress.
          </p>
        </div>
      </div>

      {/* Purpose Section */}
      <Section labelledBy="purpose-heading" className="py-24">
        <SectionHeading
          id="purpose-heading"
          eyebrow="System Analysis"
          title="Target Inefficiencies"
          className="text-white"
          description="The architecture is designed to resolve common friction points associated with legacy complaint handling."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PURPOSES.map((item) => (
            <li key={item.title} className="group relative rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-brand-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
              <div className="relative">
                <span className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-xl text-brand-400 mb-5 group-hover:scale-110 transition-transform border border-slate-700">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Objectives Section */}
      <Section className="bg-slate-900 border-y border-slate-800 py-24" labelledBy="objectives-heading">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
           <SectionHeading
            id="objectives-heading"
            eyebrow="Core Directives"
            title="Project Objectives"
            className="text-white mb-0"
            description="The foundational goals guiding the development of this prototype."
          />
        </div>
        
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OBJECTIVES.map((item) => (
            <li key={item.title} className="relative p-6 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-brand-400 mt-1 group-hover:border-brand-500/50 transition-colors">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-200 mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Capabilities Section */}
      <Section labelledBy="capabilities-heading" className="py-24">
        <SectionHeading
          id="capabilities-heading"
          eyebrow="Architecture Modules"
          title="Planned Platform Systems"
          className="text-white"
          description="The planned scope of the project. These modules are actively being built and are not yet operational."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <li key={item.title} className="group relative rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 hover:border-brand-500/30 transition-all duration-300 backdrop-blur-sm">
              <div className="absolute top-4 right-4">
                 <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-slate-800/80 border border-slate-700/50 px-2 py-1 rounded">
                   Planned
                 </span>
              </div>
              <span className="inline-flex items-center justify-center p-3 bg-slate-800/80 rounded-xl text-slate-300 mb-5 border border-slate-700/50 group-hover:text-brand-400 transition-colors">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Disclaimer Section */}
      <Section className="bg-slate-900 border-t border-slate-800 py-20" labelledBy="disclaimer-heading">
        <div className="mx-auto flex max-w-3xl flex-col sm:flex-row items-start gap-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle warning glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="relative z-10">
            <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 font-mono text-[10px] tracking-widest">
              SYSTEM_NOTICE
            </Badge>
            <h2 id="disclaimer-heading" className="mt-3 text-xl font-bold text-slate-100">
              Educational Prototype Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              This platform is an educational software prototype and is <strong className="text-slate-200">not</strong> affiliated with, operated by, or authorised by any government or police department. All data processed within this system is fictional and for demonstration purposes only.
            </p>
          </div>
        </div>
      </Section>

      {/* Emergency Info */}
      <Section spacing="sm" className="bg-slate-950 pb-24">
        <EmergencyNotice />
      </Section>

    </div>
  );
}