
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
  { icon: FileText, label: 'Complaint submitted by citizen' },
  { icon: ClipboardList, label: 'Complaint reviewed by authorised personnel' },
  { icon: CheckCircle2, label: 'Complaint status updated' },
  { icon: Bell, label: 'Citizen receives a status notification' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Online Complaint Management',
    description:
      'Submit complaint information through a structured digital process and maintain an organised record.',
  },
  {
    icon: Search,
    title: 'Complaint Status Tracking',
    description:
      'Access submitted complaint information and follow its progress through the citizen portal.',
  },
  {
    icon: Paperclip,
    title: 'Document and Evidence Upload',
    description:
      'Upload supporting documents and relevant evidence for the applicable verification and complaint processes.',
  },
  {
    icon: Eye,
    title: 'Transparent Case Updates',
    description:
      'View complaint status changes and relevant updates through your registered citizen account.',
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create a citizen account',
    description:
      'Register with your basic details and provide the required information for account verification.',
  },
  {
    icon: FileText,
    title: 'Submit complaint details',
    description:
      'Enter the incident information and provide relevant supporting documents where applicable.',
  },
  {
    icon: Hash,
    title: 'Receive a reference ID',
    description:
      'A unique complaint reference helps identify and follow your submitted complaint.',
  },
  {
    icon: ClipboardList,
    title: 'Review and processing',
    description:
      'The complaint can be reviewed and managed by authorised officers and administrators.',
  },
  {
    icon: Bell,
    title: 'Receive notifications',
    description:
      'Stay informed about relevant changes to your complaint status.',
  },
  {
    icon: Search,
    title: 'Follow complaint progress',
    description:
      'Return to your citizen account to view complaint details and available status updates.',
  },
];

const OBJECTIVES = [
  {
    title: 'Accessible citizen services',
    description:
      'Provide a convenient digital interface for citizens to access the portal and its available services.',
  },
  {
    title: 'Organised complaint records',
    description:
      'Maintain structured complaint information to support easier review and management.',
  },
  {
    title: 'Account and document verification',
    description:
      'Support citizen registration and the submission of documents for verification.',
  },
  {
    title: 'Improved complaint visibility',
    description:
      'Allow citizens to view available complaint information and follow status changes.',
  },
  {
    title: 'Role-based portal access',
    description:
      'Provide separate working areas for citizens, police officers and administrators.',
  },
];

export default function Home() {
  usePageTitle('Home');

  return (
    <>
      {/* Hero */}
      <Section spacing="lg" labelledBy="hero-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="gold" dot>
                Academic Project Prototype
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Citizen Service Portal
              </span>
            </div>

            <h1
              id="hero-heading"
              className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-brand-800 sm:text-5xl lg:text-6xl"
            >
              A Digital Approach to
              <span className="block text-brand-600">
                Citizen Police Services.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              The Digital Police Portal is an academic project prototype
              designed to bring citizen registration, complaint management,
              document submission and complaint status tracking together
              through a unified digital platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as={Link}
                to={REGISTER_PATH}
                size="lg"
                rightIcon={ArrowRight}
              >
                Create Citizen Account
              </Button>

              <Button
                as={Link}
                to={TRACK_PATH}
                variant="secondary"
                size="lg"
                leftIcon={Search}
              >
                Access Complaints
              </Button>
            </div>

            <div className="mt-7 flex items-start gap-3 border-t border-line pt-5">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <p className="max-w-lg text-sm leading-relaxed text-slate-500">
                Developed for educational and demonstration purposes.
                This portal is not an official Government of India or
                State Police website.
              </p>
            </div>
          </div>

          {/* Complaint workflow panel */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-lg bg-brand-50/70" />

            <div className="relative rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Service workflow
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-brand-800">
                    Complaint Management
                  </h2>
                </div>

                <Badge size="sm">Portal overview</Badge>
              </div>

              <ol className="mt-7 space-y-5">
                {JOURNEY.map(({ icon: Icon, label }, index) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Stage {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-relaxed text-ink">
                        {label}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-7 rounded-md bg-slate-50 p-4">
                <p className="text-xs leading-relaxed text-slate-600">
                  This workflow represents the intended complaint
                  management process within the academic prototype.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Portal services */}
      <Section tone="white" labelledBy="overview-heading">
        <SectionHeading
          id="overview-heading"
          eyebrow="Portal services"
          title="Digital services in one place"
          description="Explore the key service areas developed as part of the Digital Police Portal project."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} badge="Portal module" />
            </li>
          ))}
        </ul>
      </Section>

      {/* How it works */}
      <Section labelledBy="steps-heading">
        <SectionHeading
          id="steps-heading"
          eyebrow="Service process"
          title="How the portal works"
          description="A structured process that connects citizen registration, complaint submission and complaint management."
        />

        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <ProcessStep
              key={step.title}
              number={index + 1}
              {...step}
            />
          ))}
        </ol>

        <div className="mt-8">
          <Button
            as={Link}
            to="/how-it-works"
            variant="secondary"
            rightIcon={ArrowRight}
          >
            Explore the Complete Process
          </Button>
        </div>
      </Section>

      {/* Project objectives */}
      <Section tone="white" labelledBy="why-heading">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="why-heading"
              eyebrow="Project objectives"
              title="Building a more organised digital service experience"
              description="The project focuses on improving the accessibility, organisation and visibility of citizen-facing complaint management services."
            />
          </div>

          <ul className="space-y-6 lg:col-span-7">
            {OBJECTIVES.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <CheckCircle2
                    className="h-5 w-5 text-brand-600"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h3 className="text-base font-semibold text-brand-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Emergency information */}
      <Section spacing="sm">
        <EmergencyNotice />
      </Section>

      {/* Final call to action */}
      <Section labelledBy="cta-heading" spacing="md">
        <CallToAction
          id="cta-heading"
          title="Access the Digital Police Portal"
          description="Create a citizen account to explore the available services and access your complaint information through the portal."
        >
          <Button
            as={Link}
            to={REGISTER_PATH}
            size="lg"
            rightIcon={ArrowRight}
          >
            Register as a Citizen
          </Button>

          <Button
            as={Link}
            to="/how-it-works"
            variant="secondary"
            size="lg"
          >
            Learn More About the Portal
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}
