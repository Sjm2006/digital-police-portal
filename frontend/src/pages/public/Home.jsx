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
  UserPlus,
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import SectionHeading from '../../components/common/SectionHeading';
import FeatureCard from '../../components/common/FeatureCard';
import ProcessStep from '../../components/common/ProcessStep';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import CallToAction from '../../components/common/CallToAction';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const REGISTER_PATH = '/register';
const TRACK_PATH = '/citizen/complaints';

const JOURNEY = [
  { icon: FileText, label: 'Complaint submitted' },
  { icon: ClipboardList, label: 'Complaint under review' },
  { icon: CheckCircle2, label: 'Accepted, or rejected with a reason' },
  { icon: Bell, label: 'Status update sent to the citizen' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Online Complaint Registration',
    description: 'A single online form for submitting complaint details, designed to make registration simpler.',
  },
  {
    icon: Search,
    title: 'Complaint Tracking',
    description: 'Check the current status of a submitted complaint using its reference information.',
  },
  {
    icon: Paperclip,
    title: 'Evidence Submission',
    description: 'Attach relevant photographs and documents so supporting material stays with the complaint.',
  },
  {
    icon: Eye,
    title: 'Transparent Status Updates',
    description: 'Follow a complaint from submission through review so its progress is easier to understand.',
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Register or log in', description: 'Create a citizen account or sign in to the portal.' },
  { icon: FileText, title: 'Submit a complaint', description: 'Fill in the complaint form with the relevant details.' },
  { icon: Hash, title: 'Receive a reference ID', description: 'A unique reference ID is generated for your complaint.' },
  {
    icon: ClipboardList,
    title: 'Complaint review',
    description: 'An authorised officer or administrator reviews the complaint.',
  },
  {
    icon: Bell,
    title: 'Receive status updates',
    description: 'You are notified when the status of your complaint changes.',
  },
  { icon: Search, title: 'Track progress', description: 'Check the current status of your complaint in the portal.' },
];

const OBJECTIVES = [
  {
    title: 'Easier access to complaint registration',
    description: 'A single online form designed to make registering a complaint simpler.',
  },
  {
    title: 'Better visibility into complaint progress',
    description: 'Status information is planned to be visible to the citizen who submitted the complaint.',
  },
  {
    title: 'Organised digital records',
    description: 'Complaint details and attached evidence are planned to be kept together in one place.',
  },
  {
    title: 'Convenient access to complaint information',
    description: 'Citizens will be able to return to review the complaints they have submitted.',
  },
  {
    title: 'Improved communication through status notifications',
    description: 'Email notifications are planned for complaint registration and status changes.',
  },
];

export default function Home() {
  usePageTitle('Home');

  return (
    <>
      <Section spacing="lg" labelledBy="hero-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="gold" dot>
              Educational prototype
            </Badge>
            <h1
              id="hero-heading"
              className="mt-5 text-3xl font-bold leading-tight tracking-tight text-brand-800 sm:text-4xl lg:text-5xl"
            >
              Making Public Complaint Management More Accessible.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              A digital platform designed to simplify complaint registration, improve transparency and make complaint
              status information easier to access.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={REGISTER_PATH} size="lg" rightIcon={ArrowRight}>
                Register a Complaint
              </Button>
              <Button as={Link} to={TRACK_PATH} variant="secondary" size="lg" leftIcon={Search}>
                Track Your Complaint
              </Button>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600">
              This is a college project, not an official police service. Sign-in and complaint submission are not
              available yet.
            </p>
          </div>

          <div className="rounded border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-800">Planned complaint journey</p>
              <Badge size="sm">Illustrative preview</Badge>
            </div>

            <ol className="mt-6 space-y-4">
              {JOURNEY.map(({ icon: Icon, label }, index) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-ink">
                    <span className="sr-only">Stage {index + 1}: </span>
                    {label}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 border-t border-line pt-4 text-xs text-slate-600">
              Shown for illustration only. No real complaint data is displayed.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="overview-heading">
        <SectionHeading
          id="overview-heading"
          eyebrow="Portal overview"
          title="What the portal is designed to offer"
          description="These are planned capabilities of the educational prototype. Working functionality will be added in later development phases."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} badge="Planned" />
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="steps-heading">
        <SectionHeading
          id="steps-heading"
          eyebrow="How it works"
          title="A clear path from complaint to status"
          description="The steps below describe the intended workflow of the complete platform."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <ProcessStep key={step.title} number={index + 1} {...step} />
          ))}
        </ol>
        <div className="mt-8">
          <Button as={Link} to="/how-it-works" variant="secondary" rightIcon={ArrowRight}>
            View the full process
          </Button>
        </div>
      </Section>

      <Section tone="white" labelledBy="why-heading">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="why-heading"
              eyebrow="Our objectives"
              title="Why use this platform?"
              description="The project aims to make complaint handling easier to follow. It does not make claims about response times or guaranteed outcomes."
            />
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {OBJECTIVES.map((item) => (
              <li key={item.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <p className="text-base font-semibold text-brand-800">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section spacing="sm">
        <EmergencyNotice />
      </Section>

      <Section labelledBy="cta-heading" spacing="md">
        <CallToAction
          id="cta-heading"
          title="Explore the Digital Police Portal"
          description="See how the planned complaint process works, or head to the registration page to follow its progress as it is built."
        >
          <Button as={Link} to={REGISTER_PATH} size="lg" rightIcon={ArrowRight}>
            Register a Complaint
          </Button>
          <Button as={Link} to="/how-it-works" variant="secondary" size="lg">
            Learn How It Works
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}