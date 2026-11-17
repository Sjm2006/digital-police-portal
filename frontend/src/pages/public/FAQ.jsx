import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';
import FAQAccordion from '../../components/common/FAQAccordion';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import CallToAction from '../../components/common/CallToAction';
import Button from '../../components/ui/Button';
import { EMERGENCY_NUMBER } from '../../constants/site';

const FAQ_ITEMS = [
  {
    question: 'What is the Digital Police Portal?',
    answer:
      'It is an educational digital platform concept that demonstrates how technology could simplify complaint management, improve access to information and give greater visibility into complaint progress. It is a college project, not an operational service.',
  },
  {
    question: 'Who can use this platform?',
    answer:
      'The platform is designed for three groups: citizens who submit complaints, police officers who review assigned complaints, and administrators who supervise the system. At present only the public information pages are available.',
  },
  {
    question: 'How can I register a complaint?',
    answer:
      'In the planned workflow, you create an account, sign in and fill in a complaint form. Complaint registration is not available yet and will be built in a later development phase.',
  },
  {
    question: 'Do I need an account to submit a complaint?',
    answer:
      'The planned workflow starts with creating an account, so an account is expected to be required to submit and track complaints. Registration and login are not available yet.',
  },
  {
    question: 'How can I track my complaint?',
    answer:
      'Once available, you will sign in and view the current status of each complaint you have submitted, using its reference ID or your complaint history. Tracking is not available yet.',
  },
  {
    question: 'What is a complaint reference ID?',
    answer:
      'It is a unique identifier the system is planned to generate when a complaint is submitted, so that you can refer to that specific complaint later. No reference IDs are generated at present.',
  },
  {
    question: 'Can I upload photographs as evidence?',
    answer:
      'Evidence submission is a planned feature that would let you attach relevant photographs and documents to a complaint. File uploads are not available yet and are planned for a later phase.',
  },
  {
    question: 'What happens after I submit a complaint?',
    answer:
      'The complaint is planned to be recorded with a unique reference ID and then reviewed by an authorised officer or administrator, who accepts it for further processing or rejects it with a reason. You would then receive status updates.',
  },
  {
    question: 'How will I know if my complaint is accepted?',
    answer:
      'Status updates are planned both in the portal and as email notifications. When a complaint is accepted, its status is intended to change so that you can see the outcome.',
  },
  {
    question: 'What happens if my complaint is rejected?',
    answer:
      'A rejection is planned to include an appropriate reason that you can see alongside the complaint status. Any process for appeals or resubmission has not been defined for this prototype.',
  },
  {
    question: 'Will I receive email notifications?',
    answer:
      'Email notifications about complaint registration and status changes are a planned feature. No emails are sent at present.',
  },
  {
    question: 'Is this an official government police website?',
    answer:
      'No. This platform is an educational software prototype and is not affiliated with, operated by or authorised by any government or police department.',
  },
  {
    question: 'What should I do in an emergency?',
    answer: `Contact ${EMERGENCY_NUMBER} immediately. Do not use this portal for emergencies: it is an educational prototype and is not monitored by any emergency service.`,
  },
];

export default function FAQ() {
  usePageTitle('FAQ');

  return (
    <>
      <PageIntro
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Answers about the Digital Police Portal, written to reflect what is planned and what is not yet available."
      />

      <Section labelledBy="faq-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-heading" className="sr-only">
            Questions and answers
          </h2>
          <FAQAccordion items={FAQ_ITEMS} />
          <EmergencyNotice compact className="mt-8" />
        </div>
      </Section>

      <Section spacing="md" labelledBy="faq-cta-heading">
        <CallToAction
          id="faq-cta-heading"
          title="Still have a question?"
          description="Send a message to the project team using the contact page."
        >
          <Button as={Link} to="/contact" size="lg">
            Go to Contact
          </Button>
        </CallToAction>
      </Section>
    </>
  );
}