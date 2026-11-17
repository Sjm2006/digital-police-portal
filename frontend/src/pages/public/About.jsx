import { Bell, CheckCircle2, ClipboardList, Eye, FolderOpen, Info, LayoutDashboard, Paperclip, ShieldCheck, Users } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';
import SectionHeading from '../../components/common/SectionHeading';
import FeatureCard from '../../components/common/FeatureCard';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import Badge from '../../components/ui/Badge';

const PURPOSES = [
  {
    icon: ClipboardList,
    title: 'Manual complaint management difficulties',
    description: 'Paper-based or in-person handling can be slow to organise and hard to follow up.',
  },
  {
    icon: Eye,
    title: 'Limited visibility into complaint progress',
    description: 'People may have little visibility into what happens after they submit a complaint.',
  },
  {
    icon: FolderOpen,
    title: 'Difficulty maintaining organised records',
    description: 'Complaint details and supporting documents can become scattered and hard to retrieve.',
  },
  {
    icon: Bell,
    title: 'Lack of convenient digital status updates',
    description: 'Without digital updates, checking on a complaint may require repeated enquiries.',
  },
];

const OBJECTIVES = [
  {
    title: 'Accessibility',
    description: 'Make complaint registration easier to reach through a clear, responsive web interface.',
  },
  {
    title: 'Transparency',
    description: 'Give citizens visibility into the status of the complaints they submit.',
  },
  {
    title: 'Digital record management',
    description: 'Keep complaint details and supporting evidence organised in one system.',
  },
  {
    title: 'Organised complaint workflows',
    description: 'Support a clear path from submission through review to status updates.',
  },
  {
    title: 'Convenient communication',
    description: 'Share relevant status updates with citizens through notifications.',
  },
  {
    title: 'Responsible technology use',
    description: 'Handle information carefully and be clear about what the prototype can and cannot do.',
  },
];

const CAPABILITIES = [
  {
    icon: Users,
    title: 'Citizen Portal',
    description: 'A dashboard for citizens to submit and follow their own complaints.',
  },
  {
    icon: ShieldCheck,
    title: 'Officer Portal',
    description: 'A workspace for officers to review and update assigned complaints.',
  },
  {
    icon: LayoutDashboard,
    title: 'Administration Portal',
    description: 'Tools for administrators to supervise users, complaints, categories and stations.',
  },
  {
    icon: ClipboardList,
    title: 'Complaint Management',
    description: 'Structured handling of complaints from submission to closure.',
  },
  {
    icon: Paperclip,
    title: 'Evidence Management',
    description: 'Attach and organise photographs and documents that support a complaint.',
  },
  {
    icon: Bell,
    title: 'Notification System',
    description: 'Email notifications about complaint registration and status changes.',
  },
];

export default function About() {
  usePageTitle('About');

  return (
    <>
      <PageIntro
        eyebrow="About"
        title="About the Digital Police Portal"
        description="The Digital Police Portal is an educational digital platform concept designed to demonstrate how technology can simplify complaint management, improve information accessibility and provide greater visibility into complaint progress."
      />

      <Section labelledBy="purpose-heading">
        <SectionHeading
          id="purpose-heading"
          eyebrow="Our purpose"
          title="The problems the platform aims to address"
          description="The project is built around difficulties commonly associated with manual complaint handling."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PURPOSES.map((item) => (
            <li key={item.title}>
              <FeatureCard {...item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" labelledBy="objectives-heading">
        <SectionHeading
          id="objectives-heading"
          eyebrow="Project objectives"
          title="What the project sets out to achieve"
        />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {OBJECTIVES.map((item) => (
            <li key={item.title} className="border-l-2 border-gold-500 pl-4">
              <p className="flex items-center gap-2 text-base font-semibold text-brand-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="capabilities-heading">
        <SectionHeading
          id="capabilities-heading"
          eyebrow="Platform capabilities"
          title="Planned modules"
          description="These modules describe the intended scope of the project. They are being built in stages and are not yet operational."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <li key={item.title}>
              <FeatureCard {...item} badge="Planned" />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" labelledBy="disclaimer-heading">
        <div className="mx-auto flex max-w-3xl items-start gap-4 rounded border border-line bg-surface p-6 sm:p-8">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white text-brand-700 ring-1 ring-line">
            <Info className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="gold" size="sm">
              Educational prototype
            </Badge>
            <h2 id="disclaimer-heading" className="mt-3 text-lg font-semibold text-brand-800">
              Educational disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              This platform is an educational software prototype and is not affiliated with, operated by or
              authorised by any government or police department.
            </p>
          </div>
        </div>
      </Section>

      <Section spacing="sm">
        <EmergencyNotice />
      </Section>
    </>
  );
}