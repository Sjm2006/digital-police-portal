import { Mail, MapPin } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import PageIntro from '../../components/common/PageIntro';
import Section from '../../components/common/Section';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import ContactForm from '../../components/forms/ContactForm';
import { EMERGENCY_NUMBER } from '../../constants/site';

// Add real project contact details here when available. Empty values are not displayed.
const PROJECT_CONTACT = {
  email: '',
  location: '',
};

const CONTACT_ITEMS = [
  { icon: Mail, label: 'Email', value: PROJECT_CONTACT.email },
  { icon: MapPin, label: 'Location', value: PROJECT_CONTACT.location },
].filter((item) => item.value);

export default function Contact() {
  usePageTitle('Contact');

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Contact the project team"
        description="Have a question or some feedback about the Digital Police Portal? Prepare a message below. Sending messages is not enabled yet, and the form will say so when you submit it."
      />

      <Section labelledBy="contact-form-heading">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 id="contact-form-heading" className="text-xl font-semibold text-brand-800">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-slate-600">Fields marked with * are required.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <section
              aria-labelledby="contact-info-heading"
              className="rounded border border-line bg-white p-6 shadow-card"
            >
              <h2 id="contact-info-heading" className="text-lg font-semibold text-brand-800">
                Contact information
              </h2>

              {CONTACT_ITEMS.length > 0 ? (
                <dl className="mt-4 space-y-4">
                  {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-brand-50 text-brand-700">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</dt>
                        <dd className="mt-0.5 text-sm text-ink">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Project contact details have not been published yet. This is an educational college project and
                  has no official office, station or helpline.
                </p>
              )}
            </section>

            <EmergencyNotice
              compact
              message={`For immediate emergency assistance, contact ${EMERGENCY_NUMBER}.`}
            />
          </div>
        </div>
      </Section>
    </>
  );
}