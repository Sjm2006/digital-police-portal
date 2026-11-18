import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CheckCircle2, ClipboardList, FileText, Hash, Info, Search, UserPlus, Workflow } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import TimelineStep from '../../components/common/TimelineStep';
import CallToAction from '../../components/common/CallToAction';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const STEPS = [
  { icon: UserPlus, title: 'Account Registration', description: 'A citizen creates an account and accesses the portal.', detail: 'You sign up once with basic details, then use the same account each time.' },
  { icon: FileText, title: 'Complaint Submission', description: 'The citizen fills in the complaint form and provides relevant information.', detail: 'You describe what happened, when and where, and can attach supporting files.' },
  { icon: Hash, title: 'Reference ID Generation', description: 'The system generates a unique complaint reference ID.', detail: 'Keep this number. It is how you refer to your complaint later.' },
  { icon: ClipboardList, title: 'Complaint Review', description: 'An authorised officer or administrator reviews the submitted complaint.', detail: 'Someone with the right permissions reads your complaint and checks it.' },
  { icon: CheckCircle2, title: 'Acceptance or Rejection', description: 'The complaint is accepted for further processing or rejected with an appropriate reason.', detail: 'You are told the outcome. If a complaint is rejected, a reason is given.' },
  { icon: Bell, title: 'Status Notification', description: 'The citizen receives relevant updates about the complaint.', detail: 'Updates are planned to reach you by email when the status changes.' },
  { icon: Search, title: 'Complaint Tracking', description: "The citizen can check the complaint's current status through the portal.", detail: 'Sign in at any time to see where your complaint currently stands.' },
];

export default function HowItWorks() {
  usePageTitle('How It Works');

  return (
    <div className="bg-slate-950 text-slate-300 selection:bg-brand-500/30 min-h-screen">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="outline" className="mb-6 border-brand-500/50 text-brand-400 bg-brand-500/10 backdrop-blur-sm">
            <Workflow className="w-3 h-3 mr-2" /> Operational_Protocol
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">Workflow</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-400 max-w-3xl mx-auto">
            The Digital Police Portal is designed around a structured, seven-step complaint lifecycle. Each phase is outlined below.
          </p>
        </div>
      </div>

      <Section labelledBy="workflow-heading" className="py-24">
        <h2 id="workflow-heading" className="sr-only">Complaint workflow steps</h2>

        <div role="note" className="mx-auto flex max-w-4xl items-start gap-4 rounded-xl border border-brand-500/30 bg-brand-500/5 p-5 text-sm leading-relaxed text-slate-300 backdrop-blur-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden="true" />
          <p>
            <span className="font-semibold text-white">System Status: Planned.</span> The portal is an educational prototype currently being built in stages, so these operational steps are not yet available.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl relative">
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-800 hidden sm:block" />
          <ol className="relative z-10 space-y-6">
             {STEPS.map((step, index) => (
              <div key={step.title} className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity pointer-events-none" />
                 <TimelineStep number={index + 1} isLast={index === STEPS.length - 1} {...step} />
              </div>
            ))}
          </ol>
        </div>
      </Section>

      <Section spacing="md" labelledBy="how-cta-heading" className="bg-slate-900 border-t border-slate-800 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-8 sm:p-12 text-center shadow-2xl max-w-4xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-brand-600/20 blur-[80px] rounded-full pointer-events-none" />
          <h2 id="how-cta-heading" className="text-2xl font-bold text-white mb-4">Have questions about the process?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">The Knowledge Base answers common questions regarding accounts, reference IDs, and evidence protocols.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button as={Link} to="/faq" size="lg" className="bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(var(--brand-600-rgb),0.3)] border border-brand-500/50" rightIcon={ArrowRight}>
              Read the FAQ
            </Button>
            <Button as={Link} to="/services" variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View Planned Services
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}