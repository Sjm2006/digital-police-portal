import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CheckCircle2, ClipboardList, FileText, Hash, Info, Search, UserPlus } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';
import TimelineStep from '../../components/common/TimelineStep';
import CallToAction from '../../components/common/CallToAction';
import Button from '../../components/ui/Button';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Account Registration',
    description: 'A citizen creates an account and accesses the portal.',
    detail: 'You sign up once with basic details, then use the same account each time.',
  },
  {
    icon: FileText,
    title: 'Complaint Submission',
    description: 'The citizen fills in the complaint form and provides relevant information.',
    detail: 'You describe what happened, when and where, and can attach supporting files.',
  },
  {
    icon: Hash,
    title: 'Reference ID Generation',
    description: 'The system generates a unique complaint reference ID.',
    detail: 'Keep this number. It is how you refer to your complaint later.',
  },
  {
    icon: ClipboardList,
    title: 'Complaint Review',
    description: 'An authorised officer or administrator reviews the submitted complaint.',
    detail: 'Someone with the right permissions reads your complaint and checks it.',
  },
  {
    icon: CheckCircle2,
    title: 'Acceptance or Rejection',
    description:
      'The complaint is accepted for further processing or rejected with an appropriate reason.',
    detail: 'You are told the outcome. If a complaint is rejected, a reason is given.',
  },
  {
    icon: Bell,
    title: 'Status Notification',
    description: 'The citizen receives relevant updates about the complaint.',
    detail: 'Updates are planned to reach you by email when the status changes.',
  },
  {
    icon: Search,
    title: 'Complaint Tracking',
    description: "The citizen can check the complaint's current status through the portal.",
    detail: 'Sign in at any time to see where your complaint currently stands.',
  },
];

export default function HowItWorks() {
  usePageTitle('How It Works');

  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title="From submission to status, step by step"
        description="The Digital Police Portal is designed around a simple, seven-step complaint workflow. Each step is explained below in plain language."
      />

      <Section labelledBy="workflow-heading">
        <h2 id="workflow-heading" className="sr-only">
          Complaint workflow steps
        </h2>

        <div
          role="note"
          className="mx-auto flex max-w-3xl items-start gap-3 rounded border border-line bg-white p-4 text-sm leading-relaxed text-slate-700"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden="true" />
          <p>
            <span className="font-semibold text-ink">This is the planned workflow.</span> The portal is an educational
            prototype that is being built in stages, so these steps are not yet available.
          </p>
        </div>

        <ol className="mx-auto mt-10 max-w-3xl">
          {STEPS.map((step, index) => (
            <TimelineStep key={step.title} number={index + 1} isLast={index === STEPS.length - 1} {...step} />
          ))}
        </ol>
      </Section>

      <Section spacing="md" labelledBy="how-cta-heading">
        <CallToAction
          id="how-cta-heading"
          title="Have questions about the process?"
          description="The FAQ answers common questions about accounts, reference IDs, evidence and notifications."
        >
          <Button as={Link} to="/faq" size="lg" rightIcon={ArrowRight}>
            Read the FAQ
          </Button>
          <Button as={Link} to="/services" variant="secondary" size="lg">
            View planned services
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}