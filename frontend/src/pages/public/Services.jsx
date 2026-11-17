import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileText, History, Info, Mail, Paperclip, Search } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';
import FeatureCard from '../../components/common/FeatureCard';
import CallToAction from '../../components/common/CallToAction';
import Button from '../../components/ui/Button';

const SERVICES = [
  {
    icon: FileText,
    title: 'Online Complaint Registration',
    description: 'Citizens will be able to submit complaints digitally.',
  },
  {
    icon: Search,
    title: 'Complaint Status Tracking',
    description: 'Citizens will be able to check the progress of submitted complaints using their reference information.',
  },
  {
    icon: Paperclip,
    title: 'Evidence and Document Submission',
    description: 'Citizens will be able to attach relevant photographs and documents to support their complaints.',
  },
  {
    icon: History,
    title: 'Complaint History',
    description: 'Citizens will be able to view their previously submitted complaints.',
  },
  {
    icon: Mail,
    title: 'Email Notifications',
    description: 'Citizens will receive relevant notifications about complaint registration and status changes.',
  },
  {
    icon: ClipboardList,
    title: 'Administrative Complaint Management',
    description: 'Authorised personnel will be able to review and manage complaints through their respective dashboards.',
  },
];

export default function Services() {
  usePageTitle('Services');

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Planned services"
        description="An overview of the services the Digital Police Portal is designed to offer once its development phases are complete."
      />

      <Section labelledBy="services-heading">
        <h2 id="services-heading" className="sr-only">
          Service list
        </h2>

        <div
          role="note"
          className="flex items-start gap-3 rounded border border-line bg-white p-4 text-sm leading-relaxed text-slate-700"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden="true" />
          <p>
            <span className="font-semibold text-ink">These services are planned, not yet available.</span> They
            describe the intended scope of the educational prototype and will become available as the later
            development phases are completed.
          </p>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.title}>
              <FeatureCard {...service} badge="Planned" />
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="md" labelledBy="services-cta-heading">
        <CallToAction
          id="services-cta-heading"
          title="Want to see how it fits together?"
          description="Read the step-by-step complaint process, or browse the frequently asked questions."
        >
          <Button as={Link} to="/how-it-works" size="lg" rightIcon={ArrowRight}>
            How It Works
          </Button>
          <Button as={Link} to="/faq" variant="secondary" size="lg">
            Read the FAQ
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}