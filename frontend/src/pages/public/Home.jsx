
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  FileText,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  Eye,
  LockKeyhole,
  Landmark,
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

const SERVICES = [
  {
    icon: FileText,
    title: 'Online Complaint Registration',
    description:
      'Submit complaint details through the citizen portal using a structured online process.',
  },
  {
    icon: Search,
    title: 'Complaint Status Tracking',
    description:
      'Access your registered complaints and view available progress updates.',
  },
  {
    icon: FileCheck,
    title: 'Document Submission',
    description:
      'Submit supporting documents for applicable registration and complaint processes.',
  },
  {
    icon: Users,
    title: 'Citizen Account Services',
    description:
      'Create and manage your citizen account to access available portal services.',
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: 'Citizen Registration',
    description:
      'Create an account by providing the required personal and contact information.',
  },
  {
    icon: FileText,
    title: 'Complaint Submission',
    description:
      'Enter the relevant incident details and attach supporting documents where applicable.',
  },
  {
    icon: ClipboardList,
    title: 'Review and Processing',
    description:
      'Submitted complaints can be reviewed and managed by authorised portal personnel.',
  },
  {
    icon: Bell,
    title: 'Status Updates',
    description:
      'Check your account for available complaint progress and status notifications.',
  },
];

const OBJECTIVES = [
  {
    icon: ShieldCheck,
    title: 'Citizen-focused services',
    description:
      'Provide a convenient digital interface for accessing available citizen services.',
  },
  {
    icon: Eye,
    title: 'Greater visibility',
    description:
      'Enable citizens to view complaint records and available status updates.',
  },
  {
    icon: LockKeyhole,
    title: 'Account and document verification',
    description:
      'Support account verification and secure handling of submitted documents.',
  },
];

export default function Home() {
  usePageTitle('Home');

  return (
    <>
      {/* Government-style information strip */}
      <div className="border-b border-slate-200 bg-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs text-slate-700 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-medium">
            Digital Police Portal | Citizen Service Platform
          </p>
          <p>
            Educational Project Prototype — Not an Official Government Website
          </p>
        </div>
      </div>

      {/* Official-style identity banner */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              <Landmark className="h-9 w-9 text-brand-800" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Citizen Service Portal
              </p>
              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-brand-800 sm:text-2xl">
                DIGITAL POLICE PORTAL
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                A Digital Platform for Citizen Police Services
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              as={Link}
              to={REGISTER_PATH}
              size="md"
              rightIcon={ArrowRight}
            >
              Citizen Registration
            </Button>
            <Button
              as={Link}
              to={TRACK_PATH}
              size="md"
              variant="secondary"
              leftIcon={Search}
            >
              Track Complaint
            </Button>
          </div>
        </div>
      </section>

      {/* Main introduction */}
      <Section spacing="lg" labelledBy="hero-heading">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Badge variant="gold" dot>
              Citizen Services
            </Badge>

            <h2
              id="hero-heading"
              className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-brand-800 sm:text-5xl"
            >
              Serving Citizens Through
              <span className="block text-brand-600">
                Digital Police Services
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              The Digital Police Portal is an academic project prototype
              designed to provide a unified digital interface for citizen
              registration, online complaint submission, document
              verification and complaint status tracking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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
                to={TRACK_PATH}
                size="lg"
                variant="secondary"
                leftIcon={Search}
              >
                View Complaints
              </Button>
            </div>

            <div className="mt-8 border-l-4 border-brand-500 bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-600">
                <strong className="text-brand-800">Important:</strong>{' '}
                This platform is developed for academic and demonstration
                purposes. It is not affiliated with the Government of India
                or any State Police Department.
              </p>
            </div>
          </div>

          {/* Citizen service information panel */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
              <div className="bg-brand-800 px-6 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Citizen Information
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  Access Portal Services
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Use the available services to manage your citizen account
                  and complaint information.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <Link
                  to={REGISTER_PATH}
                  className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-600">
                    <UserPlus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-brand-800">
                      New Citizen Registration
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Create a citizen portal account
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </Link>

                <Link
                  to={TRACK_PATH}
                  className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-700">
                    <Search className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-brand-800">
                      Complaint Tracking
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Access your complaint information
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-800">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-brand-800">
                      Service Guidelines
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Understand the portal process
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services directory */}
      <Section tone="white" labelledBy="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow="Citizen service directory"
          title="Services Available on the Portal"
          description="Access the digital services provided through this academic project prototype."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <li key={service.title}>
              <FeatureCard {...service} badge="Citizen Service" />
            </li>
          ))}
        </ul>
      </Section>

      {/* Process */}
      <Section labelledBy="process-heading">
        <SectionHeading
          id="process-heading"
          eyebrow="Service delivery process"
          title="How to Use the Portal"
          description="Follow these steps to access the available citizen services."
        />

        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
            Read Service Guidelines
          </Button>
        </div>
      </Section>

      {/* Public information */}
      <Section tone="white" labelledBy="information-heading">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="information-heading"
              eyebrow="Public information"
              title="A Structured Digital Service Environment"
              description="The portal is designed around accessibility, organised records and role-based access to citizen service functions."
            />
          </div>

          <div className="space-y-6 lg:col-span-7">
            {OBJECTIVES.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-brand-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Citizen safety information */}
      <Section labelledBy="safety-heading">
        <SectionHeading
          id="safety-heading"
          eyebrow="Citizen awareness"
          title="Safety and Emergency Information"
          description="Stay informed and use appropriate emergency services when immediate assistance is required."
        />

        <div className="mt-8">
          <EmergencyNotice />
        </div>
      </Section>

      {/* Final citizen access */}
      <Section spacing="md" labelledBy="cta-heading">
        <CallToAction
          id="cta-heading"
          title="Access Citizen Portal Services"
          description="Register for a citizen account to explore the available digital services and access your complaint information."
        >
          <Button
            as={Link}
            to={REGISTER_PATH}
            size="lg"
            rightIcon={ArrowRight}
          >
            Citizen Registration
          </Button>

          <Button
            as={Link}
            to="/how-it-works"
            variant="secondary"
            size="lg"
          >
            Portal Information
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}
